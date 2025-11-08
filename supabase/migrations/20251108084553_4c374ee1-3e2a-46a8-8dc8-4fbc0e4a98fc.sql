-- Create job_positions table for managing career postings
CREATE TABLE public.job_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'briefcase',
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.job_positions ENABLE ROW LEVEL SECURITY;

-- Anyone can view active positions
CREATE POLICY "Anyone can view active positions"
ON public.job_positions
FOR SELECT
USING (is_active = true);

-- Admins can view all positions
CREATE POLICY "Admins can view all positions"
ON public.job_positions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert positions
CREATE POLICY "Admins can insert positions"
ON public.job_positions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update positions
CREATE POLICY "Admins can update positions"
ON public.job_positions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete positions
CREATE POLICY "Admins can delete positions"
ON public.job_positions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_job_positions_updated_at
BEFORE UPDATE ON public.job_positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Community Manager position
INSERT INTO public.job_positions (title, type, icon, description, requirements)
VALUES (
  'Community Manager',
  'Full-time',
  'users',
  'Build and nurture our growing community of creators and viewers.',
  ARRAY[
    'Experience in community management or social media',
    'Excellent communication and interpersonal skills',
    'Passion for content creation and digital media',
    'Ability to work independently and as part of a team'
  ]
);