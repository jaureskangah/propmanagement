
-- Corriger le locataire existant (Judith Kangah) en liant son profil
-- D'abord, identifions et corrigeons la liaison manquante
UPDATE tenants 
SET tenant_profile_id = '5dc9726c-41b0-406d-84c0-d781acd99e7f',
    updated_at = now()
WHERE email = (
  SELECT email FROM auth.users WHERE id = '5dc9726c-41b0-406d-84c0-d781acd99e7f'
)
AND tenant_profile_id IS NULL;

-- Mettre à jour le statut des invitations pour ce locataire (sans updated_at)
UPDATE tenant_invitations 
SET status = 'accepted'
WHERE tenant_id IN (
  SELECT id FROM tenants WHERE tenant_profile_id = '5dc9726c-41b0-406d-84c0-d781acd99e7f'
)
AND status = 'pending';

-- S'assurer que le profil utilisateur est correctement configuré
UPDATE profiles 
SET is_tenant_user = true,
    updated_at = now()
WHERE id = '5dc9726c-41b0-406d-84c0-d781acd99e7f';
