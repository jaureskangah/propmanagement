-- Secure admin_metrics RLS: remove permissive policy and restrict to admins only

-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.admin_metrics ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive/legacy policies if they exist
DROP POLICY IF EXISTS "admin_metrics_read_policy" ON public.admin_metrics;
DROP POLICY IF EXISTS "Allow read access to admin users" ON public.admin_metrics;

-- Create a strict admin-only read policy leveraging the existing has_role() function
CREATE POLICY "Admins can view admin metrics"
ON public.admin_metrics
FOR SELECT
TO authenticated
USING (has_role('admin'::app_role));