-- Add file upload and Google Drive link support to scripts table
ALTER TABLE scripts 
ADD COLUMN file_url TEXT,
ADD COLUMN google_drive_link TEXT,
ALTER COLUMN content DROP NOT NULL;

-- Add constraint to ensure at least one content source is provided
ALTER TABLE scripts
ADD CONSTRAINT scripts_content_check 
CHECK (
  content IS NOT NULL OR 
  file_url IS NOT NULL OR 
  google_drive_link IS NOT NULL
);

-- Create storage bucket for script files
INSERT INTO storage.buckets (id, name, public)
VALUES ('scripts', 'scripts', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for script files
CREATE POLICY "Users can upload their own script files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'scripts' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own script files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'scripts' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Admins can view all script files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'scripts' AND 
  has_role(auth.uid(), 'admin'::app_role)
);