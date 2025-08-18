-- Créer la table pour suivre l'utilisation quotidienne de l'assistant IA
CREATE TABLE public.ai_usage_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, usage_date)
);

-- Activer RLS
ALTER TABLE public.ai_usage_daily ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour que les utilisateurs ne voient que leurs propres données
CREATE POLICY "Users can view their own AI usage" 
ON public.ai_usage_daily 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI usage" 
ON public.ai_usage_daily 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI usage" 
ON public.ai_usage_daily 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_ai_usage_daily_updated_at
BEFORE UPDATE ON public.ai_usage_daily
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour optimiser les requêtes
CREATE INDEX idx_ai_usage_daily_user_date ON public.ai_usage_daily(user_id, usage_date);