
-- Créer une nouvelle politique RLS pour permettre aux locataires de voir leur propriété
CREATE POLICY "Tenants can view their property" 
ON public.properties 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE tenants.property_id = properties.id 
    AND tenants.tenant_profile_id = auth.uid()
  )
);
