-- Fix 1: Restrict contact_messages SELECT to admins only
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow select for service role" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow select for everyone" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (has_role('admin'::app_role));

-- Keep public INSERT for the contact form (do not modify existing INSERT policy)

-- Fix 2: Harden tenant_invitations token-based access using headers (token + email)
CREATE OR REPLACE FUNCTION public.request_header(header_name text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  select current_setting('request.header.' || header_name, true)
$$;

ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow invitation validation with token" ON public.tenant_invitations;
CREATE POLICY "Validate invitation by token and email header"
ON public.tenant_invitations
FOR SELECT
TO anon, authenticated
USING (
  status = 'pending'
  AND expires_at > now()
  AND token IS NOT NULL
  AND token = coalesce(public.request_header('invitation-token'), '')
  AND email = coalesce(public.request_header('invitation-email'), '')
);
