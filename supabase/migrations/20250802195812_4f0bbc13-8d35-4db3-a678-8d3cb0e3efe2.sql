-- Fix Supabase security issues detected by linter

-- 1. Fix function search path issues by updating functions to be SECURITY DEFINER with secure search_path
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.calculate_average_rating() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.link_tenant_profile(uuid, uuid) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.has_role(app_role) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_thread_status() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_vendor_rating() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.calculate_and_insert_metrics() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.get_auth_logs() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.get_edge_function_logs() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.get_user_tenant_data(uuid) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.get_db_logs() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = public;

-- 2. Update extensions to be in extensions schema instead of public
-- Note: This needs to be done carefully as it affects existing data
-- Moving uuid-ossp extension
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;

-- 3. Update extension versions to latest
-- Update uuid-ossp to latest version
ALTER EXTENSION "uuid-ossp" UPDATE;