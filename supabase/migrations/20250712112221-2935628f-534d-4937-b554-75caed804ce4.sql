-- Drop the existing admin policy and create a new one that works
DROP POLICY "Admins can view all profiles" ON public.profiles;

-- Create a new policy that checks user_roles directly  
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);