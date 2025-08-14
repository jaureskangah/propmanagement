-- Add policy to allow public access to invitations by token for signup
CREATE POLICY "Allow public access to invitations by token"
ON public.tenant_invitations
FOR SELECT
USING (
  status = 'pending' 
  AND expires_at > now() 
  AND token IS NOT NULL
);