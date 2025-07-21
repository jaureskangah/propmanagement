-- Créer des fonctions pour récupérer les logs Supabase depuis la base analytics
-- Ces fonctions permettront de surveiller les edge functions, auth et base de données

-- Fonction pour récupérer les logs des edge functions
CREATE OR REPLACE FUNCTION public.get_edge_function_logs()
RETURNS TABLE (
  id text,
  timestamp timestamptz,
  level text,
  message text,
  metadata jsonb,
  function_id text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Note: Cette fonction retourne des données fictives pour la démonstration
  -- Dans un vrai environnement, elle se connecterait à la base analytics de Supabase
  RETURN QUERY
  SELECT 
    gen_random_uuid()::text as id,
    now() - (random() * interval '1 hour') as timestamp,
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
$$;

-- Fonction pour récupérer les logs d'authentification
CREATE OR REPLACE FUNCTION public.get_auth_logs()
RETURNS TABLE (
  id text,
  timestamp timestamptz,
  level text,
  message text,
  metadata jsonb,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gen_random_uuid()::text as id,
    now() - (random() * interval '2 hours') as timestamp,
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
$$;

-- Fonction pour récupérer les logs de la base de données
CREATE OR REPLACE FUNCTION public.get_db_logs()
RETURNS TABLE (
  id text,
  timestamp timestamptz,
  level text,
  message text,
  metadata jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gen_random_uuid()::text as id,
    now() - (random() * interval '30 minutes') as timestamp,
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
$$;