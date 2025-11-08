-- Create table for project contributors with commission splits
CREATE TABLE public.project_contributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payhip_affiliate_id TEXT NOT NULL,
  commission_percentage DECIMAL(5,2) NOT NULL CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(video_id, user_id)
);

-- Create table for Payhip sales data
CREATE TABLE public.payhip_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
  payhip_sale_id TEXT UNIQUE NOT NULL,
  affiliate_link TEXT,
  affiliate_id TEXT NOT NULL,
  sale_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  sale_date TIMESTAMPTZ NOT NULL,
  buyer_email TEXT,
  product_name TEXT,
  imported_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  imported_by UUID REFERENCES auth.users(id)
);

-- Create table for calculated commission splits
CREATE TABLE public.commission_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES public.payhip_sales(id) ON DELETE CASCADE NOT NULL,
  contributor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_percentage DECIMAL(5,2) NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create table for payout tracking
CREATE TABLE public.payout_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payout_date DATE NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.project_contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payhip_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_contributors
CREATE POLICY "Admins can manage project contributors"
ON public.project_contributors FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Contributors can view their assignments"
ON public.project_contributors FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for payhip_sales
CREATE POLICY "Admins can manage sales data"
ON public.payhip_sales FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for commission_splits
CREATE POLICY "Admins can view all commission splits"
ON public.commission_splits FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Contributors can view their own commissions"
ON public.commission_splits FOR SELECT
USING (auth.uid() = contributor_id);

-- RLS Policies for payout_records
CREATE POLICY "Admins can manage payouts"
ON public.payout_records FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Contributors can view their own payouts"
ON public.payout_records FOR SELECT
USING (auth.uid() = contributor_id);

-- Create indexes for performance
CREATE INDEX idx_project_contributors_video_id ON public.project_contributors(video_id);
CREATE INDEX idx_project_contributors_user_id ON public.project_contributors(user_id);
CREATE INDEX idx_payhip_sales_video_id ON public.payhip_sales(video_id);
CREATE INDEX idx_payhip_sales_affiliate_id ON public.payhip_sales(affiliate_id);
CREATE INDEX idx_commission_splits_contributor_id ON public.commission_splits(contributor_id);
CREATE INDEX idx_commission_splits_video_id ON public.commission_splits(video_id);
CREATE INDEX idx_payout_records_contributor_id ON public.payout_records(contributor_id);

-- Add trigger for updated_at
CREATE TRIGGER update_project_contributors_updated_at
BEFORE UPDATE ON public.project_contributors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();