-- Corriger les fonctions avec search_path mutable pour la sécurité
-- Mettre à jour clean_old_ai_validation_logs avec search_path sécurisé
CREATE OR REPLACE FUNCTION clean_old_ai_validation_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.ai_validation_logs 
  WHERE created_at < now() - interval '30 days';
END;
$$;