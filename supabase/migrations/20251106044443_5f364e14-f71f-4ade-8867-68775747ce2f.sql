-- Refactor creator_applications RLS policies for better security isolation
-- Separate user viewing from admin viewing into distinct policies

-- Drop the combined policy
DROP POLICY IF EXISTS "Users can view their own applications" ON public.creator_applications;

-- Create separate policies for users and admins
CREATE POLICY "Users can view their own applications"
    ON public.creator_applications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
    ON public.creator_applications FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- The other policies remain unchanged but listed here for reference:
-- "Users can insert their own applications" - already properly scoped
-- "Admins can update applications" - already properly scoped