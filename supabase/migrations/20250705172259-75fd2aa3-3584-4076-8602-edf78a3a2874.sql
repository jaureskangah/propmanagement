
-- D'abord, vérifions l'état actuel de Nydie dans la base de données
SELECT 
  t.id as tenant_id,
  t.name,
  t.email,
  t.tenant_profile_id,
  au.id as auth_user_id,
  ti.id as invitation_id,
  ti.status as invitation_status,
  ti.token,
  ti.expires_at
FROM tenants t
LEFT JOIN auth.users au ON au.email = t.email
LEFT JOIN tenant_invitations ti ON ti.tenant_id = t.id
WHERE t.email = 'landry.nydie@gmail.com'
ORDER BY ti.created_at DESC;

-- Ensuite, corrigeons la liaison du profil locataire
UPDATE tenants 
SET tenant_profile_id = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'landry.nydie@gmail.com'
),
updated_at = now()
WHERE email = 'landry.nydie@gmail.com' 
AND tenant_profile_id IS NULL;

-- Mettons à jour le statut de l'invitation à 'accepted'
UPDATE tenant_invitations 
SET status = 'accepted'
WHERE tenant_id = (
  SELECT id FROM tenants WHERE email = 'landry.nydie@gmail.com'
)
AND status = 'pending';

-- S'assurer que le profil utilisateur est correctement configuré comme locataire
UPDATE profiles 
SET is_tenant_user = true,
    updated_at = now()
WHERE id = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'landry.nydie@gmail.com'
)
AND (is_tenant_user IS NULL OR is_tenant_user = false);

-- Vérification finale pour confirmer que tout est correct
SELECT 
  t.id as tenant_id,
  t.name,
  t.email,
  t.tenant_profile_id,
  p.is_tenant_user,
  ti.status as invitation_status
FROM tenants t
LEFT JOIN profiles p ON p.id = t.tenant_profile_id
LEFT JOIN tenant_invitations ti ON ti.tenant_id = t.id
WHERE t.email = 'landry.nydie@gmail.com'
ORDER BY ti.created_at DESC;
