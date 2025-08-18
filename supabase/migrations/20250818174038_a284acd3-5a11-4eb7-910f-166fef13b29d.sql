-- Créer une table pour logger les validations IA et détecter les hallucinations
CREATE TABLE IF NOT EXISTS public.ai_validation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  validation_result JSONB NOT NULL,
  ai_response TEXT,
  context_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.ai_validation_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les administrateurs peuvent lire les logs de validation
CREATE POLICY "Only admins can view AI validation logs" 
ON public.ai_validation_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Index pour performance
CREATE INDEX idx_ai_validation_logs_user_created 
ON public.ai_validation_logs(user_id, created_at DESC);

CREATE INDEX idx_ai_validation_logs_validation_errors 
ON public.ai_validation_logs USING GIN((validation_result->'errors'));

-- Fonction pour nettoyer les anciens logs (gardez seulement 30 jours)
CREATE OR REPLACE FUNCTION clean_old_ai_validation_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.ai_validation_logs 
  WHERE created_at < now() - interval '30 days';
END;
$$;