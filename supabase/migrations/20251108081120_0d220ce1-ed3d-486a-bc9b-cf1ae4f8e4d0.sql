-- Add missing fields to creator_applications table
ALTER TABLE public.creator_applications
ADD COLUMN IF NOT EXISTS creator_type text,
ADD COLUMN IF NOT EXISTS affiliate_link text;

-- Add a comment to document the creator_type values
COMMENT ON COLUMN public.creator_applications.creator_type IS 'Type of creator: script_writer, video_creator, or video_editor';