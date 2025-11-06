-- Fix nullable user_id columns to prevent RLS bypass
-- This ensures all records are properly attributed to users
ALTER TABLE creator_applications 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE job_applications 
  ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraints for data integrity
ALTER TABLE creator_applications
  ADD CONSTRAINT fk_creator_applications_user 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE job_applications
  ADD CONSTRAINT fk_job_applications_user 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Prevent admin privilege escalation by blocking direct INSERT
CREATE POLICY "Block direct role assignment"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Allow admins to manage roles (for future admin features)
CREATE POLICY "Admins can update roles"
  ON user_roles
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
  ON user_roles
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));