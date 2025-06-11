
-- Corriger la liaison entre le tenant "Jaureskk" et son profil utilisateur
-- D'abord, trouvons le tenant par email et nom
UPDATE tenants 
SET tenant_profile_id = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'academiedesanges2024@gmail.com'
)
WHERE email = 'academiedesanges2024@gmail.com' 
AND name = 'Jaureskk'
AND tenant_profile_id IS NULL;

-- S'assurer que le profil existe et est correctement configuré
INSERT INTO profiles (id, is_tenant_user, email, first_name, last_name)
SELECT 
  au.id,
  true,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'Jaureskk'),
  COALESCE(au.raw_user_meta_data->>'last_name', '')
FROM auth.users au
WHERE au.email = 'academiedesanges2024@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  is_tenant_user = true,
  email = EXCLUDED.email,
  first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
  last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
