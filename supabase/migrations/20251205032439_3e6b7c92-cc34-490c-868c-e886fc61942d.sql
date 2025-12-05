-- Allow admins to insert creator applications for any user
CREATE POLICY "Admins can insert applications" 
ON public.creator_applications 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));