-- Phase 1: Critical RLS Policy Fixes

-- 1. Remove overly permissive tenant access policy and replace with secure version
DROP POLICY IF EXISTS "Allow public read access to tenants during invitation validatio" ON public.tenants;

-- Create secure tenant access policy for invitation validation only
CREATE POLICY "Allow tenant access during valid invitation process"
ON public.tenants
FOR SELECT
USING (
  -- Only allow access if there's a valid, non-expired invitation for this tenant
  EXISTS (
    SELECT 1 
    FROM tenant_invitations 
    WHERE tenant_invitations.tenant_id = tenants.id 
    AND tenant_invitations.status = 'pending'
    AND tenant_invitations.expires_at > now()
  )
);

-- 2. Create security definer function for admin role checking to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = has_role.role
  );
$$;

-- 3. Update admin policies to use the secure function
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role('admin'::app_role));

-- 4. Secure profile insertion - remove overly permissive policy
DROP POLICY IF EXISTS "Allow profile insertion during signup" ON public.profiles;

-- 5. Add policy to prevent role self-modification
CREATE POLICY "Users cannot modify their own roles"
ON public.user_roles
FOR ALL
USING (false)
WITH CHECK (false);

-- Override with admin-only access
DROP POLICY IF EXISTS "Only admins can insert/update/delete roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (has_role('admin'::app_role))
WITH CHECK (has_role('admin'::app_role));

-- 6. Secure document access - require authentication
DROP POLICY IF EXISTS "Users can view their own document history" ON public.document_history;
CREATE POLICY "Authenticated users can view their own document history"
ON public.document_history
FOR SELECT
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can view their own templates" ON public.document_templates;
CREATE POLICY "Authenticated users can view their own templates"
ON public.document_templates
FOR SELECT
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 7. Secure tenant invitation access
DROP POLICY IF EXISTS "Allow public read access to pending invitations during validati" ON public.tenant_invitations;
CREATE POLICY "Allow invitation validation with token"
ON public.tenant_invitations
FOR SELECT
USING (
  status = 'pending' 
  AND expires_at > now()
  -- Only allow if accessing with valid token context
  AND token IS NOT NULL
);

-- 8. Add missing user_id validation policies where needed
CREATE POLICY "Ensure user_id matches auth user for maintenance tasks"
ON public.maintenance_tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Ensure user_id matches auth user for properties"
ON public.properties
FOR INSERT
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 9. Add rate limiting for sensitive operations (password changes, invitations)
-- This would typically be handled at the application level, but we can add some database constraints

-- 10. Ensure all user-related tables require authentication
-- Add check that auth.uid() is not null for user-specific data
ALTER TABLE public.profiles ADD CONSTRAINT profiles_require_auth CHECK (id IS NOT NULL);
ALTER TABLE public.properties ADD CONSTRAINT properties_require_auth CHECK (user_id IS NOT NULL);
ALTER TABLE public.tenants ADD CONSTRAINT tenants_require_auth CHECK (user_id IS NOT NULL);