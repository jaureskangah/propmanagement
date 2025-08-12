-- Security hardening (idempotent): subscribers, contact_messages, tenants policies

-- 1) Subscribers: restrict INSERT/UPDATE to owner by user_id or email
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Drop pre-existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can insert own subscriber row" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update own subscriber row" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_subscription" ON public.subscribers;

-- Recreate with strict checks
CREATE POLICY "Users can insert own subscriber row"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK ((user_id = auth.uid()) OR (email = auth.email()));

CREATE POLICY "Users can update own subscriber row"
ON public.subscribers
FOR UPDATE
TO authenticated
USING ((user_id = auth.uid()) OR (email = auth.email()));

-- 2) contact_messages: limit SELECT to service_role only (keep public INSERT as-is elsewhere)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow select for service role" ON public.contact_messages;
CREATE POLICY "Allow select for service role"
ON public.contact_messages
FOR SELECT
TO service_role
USING (true);

-- 3) tenants: remove broad self-linking UPDATE policy (enforced via RPC instead)
DROP POLICY IF EXISTS "Tenants can link their profile" ON public.tenants;