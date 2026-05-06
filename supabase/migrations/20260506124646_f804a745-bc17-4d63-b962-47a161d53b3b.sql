-- Remove the overly permissive SELECT policy that exposed all subscriber emails
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.newsletter_subscriptions;

-- Only admins can view subscriber emails
CREATE POLICY "Admins can view newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));