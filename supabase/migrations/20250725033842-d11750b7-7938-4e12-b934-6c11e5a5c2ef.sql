-- Security fixes for database

-- Fix 1: Enable RLS on tables that have policies but RLS disabled
-- Check which tables need RLS enabled by looking at existing policies
ALTER TABLE admin_metrics ENABLE ROW LEVEL SECURITY;

-- Fix 2: Update all functions to have secure search_path
-- Update existing functions with proper search_path
CREATE OR REPLACE FUNCTION public.calculate_average_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.rating = ROUND((NEW.quality_rating + NEW.price_rating + NEW.punctuality_rating)::numeric / 3, 1);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_thread_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        UPDATE tenant_communications
        SET status = 'read'
        WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = has_role.role
  );
$function$;

CREATE OR REPLACE FUNCTION public.update_vendor_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Calculer la nouvelle note moyenne pour le prestataire concerné
  UPDATE vendors 
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM vendor_reviews 
    WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
  )
  WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_and_insert_metrics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    total_users_count INTEGER;
    active_users_count INTEGER;
    total_properties_count INTEGER;
    total_tenants_count INTEGER;
    total_revenue_sum NUMERIC;
BEGIN
    -- Calculer le nombre total d'utilisateurs
    SELECT COUNT(*) INTO total_users_count FROM auth.users;
    
    -- Calculer le nombre d'utilisateurs actifs (connectés dans les 30 derniers jours)
    SELECT COUNT(*) INTO active_users_count 
    FROM auth.users 
    WHERE last_sign_in_at >= NOW() - INTERVAL '30 days';
    
    -- Calculer le nombre total de propriétés
    SELECT COUNT(*) INTO total_properties_count FROM properties;
    
    -- Calculer le nombre total de locataires
    SELECT COUNT(*) INTO total_tenants_count FROM tenants;
    
    -- Calculer le revenu total (somme des paiements)
    SELECT COALESCE(SUM(amount), 0) INTO total_revenue_sum FROM tenant_payments;
    
    -- Insérer les métriques
    INSERT INTO admin_metrics (
        total_users,
        active_users,
        total_properties,
        total_tenants,
        total_revenue,
        metric_date
    ) VALUES (
        total_users_count,
        active_users_count,
        total_properties_count,
        total_tenants_count,
        total_revenue_sum,
        CURRENT_DATE
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_edge_function_logs()
 RETURNS TABLE(id text, log_timestamp timestamp with time zone, level text, message text, metadata jsonb, function_id text, status text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Note: Cette fonction retourne des données fictives pour la démonstration
  -- Dans un vrai environnement, elle se connecterait à la base analytics de Supabase
  RETURN QUERY
  SELECT 
    gen_random_uuid()::text as id,
    now() - (random() * interval '1 hour') as log_timestamp,
    CASE 
      WHEN random() < 0.1 THEN 'error'
      WHEN random() < 0.3 THEN 'warn'
      ELSE 'info'
    END as level,
    'Function executed successfully' as message,
    jsonb_build_object(
      'duration', (random() * 1000)::integer,
      'memory_used', (random() * 128)::integer
    ) as metadata,
    CASE 
      WHEN random() < 0.3 THEN 'send-tenant-email'
      WHEN random() < 0.6 THEN 'generate-document-content'
      ELSE 'share-document'
    END as function_id,
    CASE 
      WHEN random() < 0.9 THEN '200'
      ELSE '500'
    END as status
  FROM generate_series(1, 10);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_tenant_data(p_user_id uuid)
 RETURNS TABLE(tenant_id uuid, tenant_name text, tenant_email text, property_name text, is_tenant boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as tenant_id,
    t.name as tenant_name,
    t.email as tenant_email,
    p.name as property_name,
    true as is_tenant
  FROM tenants t
  LEFT JOIN properties p ON t.property_id = p.id
  WHERE t.tenant_profile_id = p_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_auth_logs()
 RETURNS TABLE(id text, log_timestamp timestamp with time zone, level text, message text, metadata jsonb, status text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    gen_random_uuid()::text as id,
    now() - (random() * interval '2 hours') as log_timestamp,
    CASE 
      WHEN random() < 0.05 THEN 'error'
      WHEN random() < 0.15 THEN 'warn'
      ELSE 'info'
    END as level,
    CASE 
      WHEN random() < 0.3 THEN 'User login successful'
      WHEN random() < 0.6 THEN 'Password reset requested'
      ELSE 'User registration completed'
    END as message,
    jsonb_build_object(
      'user_agent', 'Mozilla/5.0 (compatible browser)',
      'ip_address', '192.168.1.' || (random() * 255)::integer
    ) as metadata,
    CASE 
      WHEN random() < 0.95 THEN '200'
      ELSE '401'
    END as status
  FROM generate_series(1, 8);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_db_logs()
 RETURNS TABLE(id text, log_timestamp timestamp with time zone, level text, message text, metadata jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    gen_random_uuid()::text as id,
    now() - (random() * interval '30 minutes') as log_timestamp,
    CASE 
      WHEN random() < 0.02 THEN 'error'
      WHEN random() < 0.08 THEN 'warn'
      ELSE 'info'
    END as level,
    CASE 
      WHEN random() < 0.2 THEN 'Slow query detected'
      WHEN random() < 0.4 THEN 'Connection established'
      WHEN random() < 0.6 THEN 'Query executed successfully'
      WHEN random() < 0.8 THEN 'Index scan performed'
      ELSE 'Checkpoint completed'
    END as message,
    jsonb_build_object(
      'duration_ms', (random() * 500)::integer,
      'rows_affected', (random() * 100)::integer,
      'query_type', CASE 
        WHEN random() < 0.5 THEN 'SELECT'
        WHEN random() < 0.8 THEN 'INSERT'
        ELSE 'UPDATE'
      END
    ) as metadata
  FROM generate_series(1, 12);
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, first_name, last_name, email, is_tenant_user)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    (new.raw_user_meta_data->>'is_tenant_user')::boolean
  );
  return new;
end;
$function$;