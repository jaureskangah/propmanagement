-- Add RLS policy to allow access to tenant data via valid invitations
CREATE POLICY "Allow access to tenant data via valid invitations" 
ON tenants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM tenant_invitations 
    WHERE tenant_invitations.tenant_id = tenants.id 
    AND tenant_invitations.status = 'pending' 
    AND tenant_invitations.expires_at > now()
  )
);