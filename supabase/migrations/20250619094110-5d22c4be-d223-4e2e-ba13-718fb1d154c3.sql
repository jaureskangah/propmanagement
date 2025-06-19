
-- Vérifier et créer les politiques RLS pour tenant_payments si nécessaire
-- Permettre aux propriétaires de voir les paiements de leurs locataires

-- Activer RLS sur tenant_payments si pas déjà fait
ALTER TABLE public.tenant_payments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux propriétaires de voir les paiements de leurs locataires
CREATE POLICY "Property owners can view their tenants payments" 
ON public.tenant_payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.tenants t 
    WHERE t.id = tenant_payments.tenant_id 
    AND t.user_id = auth.uid()
  )
);

-- Politique pour permettre aux propriétaires d'insérer des paiements pour leurs locataires
CREATE POLICY "Property owners can insert payments for their tenants" 
ON public.tenant_payments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tenants t 
    WHERE t.id = tenant_payments.tenant_id 
    AND t.user_id = auth.uid()
  )
);

-- Politique pour permettre aux propriétaires de modifier les paiements de leurs locataires
CREATE POLICY "Property owners can update their tenants payments" 
ON public.tenant_payments 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.tenants t 
    WHERE t.id = tenant_payments.tenant_id 
    AND t.user_id = auth.uid()
  )
);

-- Politique pour permettre aux propriétaires de supprimer les paiements de leurs locataires
CREATE POLICY "Property owners can delete their tenants payments" 
ON public.tenant_payments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.tenants t 
    WHERE t.id = tenant_payments.tenant_id 
    AND t.user_id = auth.uid()
  )
);

-- Activer les mises à jour en temps réel pour tenant_payments
ALTER TABLE public.tenant_payments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tenant_payments;
