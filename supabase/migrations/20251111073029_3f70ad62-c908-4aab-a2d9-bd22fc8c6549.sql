-- Allow script writers to view videos made from their scripts
CREATE POLICY "Script writers can view videos from their scripts"
ON public.videos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.scripts 
    WHERE scripts.id = videos.script_id 
    AND scripts.user_id = auth.uid()
  )
);

-- Allow video creators to view videos they created through assignments
CREATE POLICY "Video creators can view their assigned videos"
ON public.videos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.video_assignments 
    WHERE video_assignments.id = videos.assignment_id 
    AND video_assignments.assigned_to = auth.uid()
  )
);

-- Enable realtime for videos table so creators can see updates in real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.videos;