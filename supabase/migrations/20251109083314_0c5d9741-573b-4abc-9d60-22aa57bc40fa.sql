-- Allow assigned video creators to view scripts they're assigned to
CREATE POLICY "Assigned users can view scripts"
ON public.scripts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.video_assignments 
    WHERE video_assignments.script_id = scripts.id 
    AND video_assignments.assigned_to = auth.uid()
  )
);