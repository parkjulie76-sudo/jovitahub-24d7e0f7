-- Add script_id and assignment_id to videos table
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS script_id uuid REFERENCES public.scripts(id),
ADD COLUMN IF NOT EXISTS assignment_id uuid REFERENCES public.video_assignments(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_videos_script_id ON public.videos(script_id);
CREATE INDEX IF NOT EXISTS idx_videos_assignment_id ON public.videos(assignment_id);