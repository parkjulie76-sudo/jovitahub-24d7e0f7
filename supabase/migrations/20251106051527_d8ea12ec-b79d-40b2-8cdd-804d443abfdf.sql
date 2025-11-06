-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create storage bucket for cover letters
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cover-letters',
  'cover-letters',
  false,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  position text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  resume_url text NOT NULL,
  cover_letter_url text,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
  ON public.job_applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert their own applications"
  ON public.job_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.job_applications
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all applications
CREATE POLICY "Admins can update all applications"
  ON public.job_applications
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for resumes bucket
CREATE POLICY "Users can upload their own resumes"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own resumes"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all resumes"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS policies for cover-letters bucket
CREATE POLICY "Users can upload their own cover letters"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'cover-letters' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own cover letters"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'cover-letters' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all cover letters"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'cover-letters' AND
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();