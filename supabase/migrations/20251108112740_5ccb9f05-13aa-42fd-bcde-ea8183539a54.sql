-- Create table for video production assignments
CREATE TABLE public.video_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  script_id UUID NOT NULL REFERENCES public.scripts(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL,
  assigned_by UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('video_creator', 'video_editor')),
  requirements TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.video_assignments ENABLE ROW LEVEL SECURITY;

-- Admins can manage all assignments
CREATE POLICY "Admins can manage assignments"
ON public.video_assignments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own assignments
CREATE POLICY "Users can view their assignments"
ON public.video_assignments
FOR SELECT
USING (auth.uid() = assigned_to);

-- Users can update status of their assignments
CREATE POLICY "Users can update their assignment status"
ON public.video_assignments
FOR UPDATE
USING (auth.uid() = assigned_to)
WITH CHECK (auth.uid() = assigned_to);

-- Create trigger for updated_at
CREATE TRIGGER update_video_assignments_updated_at
BEFORE UPDATE ON public.video_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_video_assignments_assigned_to ON public.video_assignments(assigned_to);
CREATE INDEX idx_video_assignments_script_id ON public.video_assignments(script_id);
CREATE INDEX idx_video_assignments_status ON public.video_assignments(status);