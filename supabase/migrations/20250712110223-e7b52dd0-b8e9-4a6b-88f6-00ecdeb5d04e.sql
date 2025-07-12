-- Temporary policy to allow viewing profiles for admin dashboard (remove in production)
CREATE POLICY "Temporary admin dashboard access" 
ON public.profiles 
FOR SELECT 
USING (true);