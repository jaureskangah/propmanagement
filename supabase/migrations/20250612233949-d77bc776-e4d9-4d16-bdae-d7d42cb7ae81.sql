
-- Nettoyer les données en double et améliorer la fonction de liaison

-- 1. Supprimer les profils orphelins qui causent des conflits RLS
DELETE FROM profiles 
WHERE email = 'academiedesanges2024@gmail.com' 
AND id NOT IN (SELECT id FROM auth.users WHERE email = 'academiedesanges2024@gmail.com');

-- 2. Corriger le tenant existant pour qu'il corresponde au bon utilisateur
UPDATE tenants 
SET name = 'Jaureskk',
    tenant_profile_id = (
      SELECT id FROM auth.users 
      WHERE email = 'academiedesanges2024@gmail.com' 
      LIMIT 1
    )
WHERE email = 'academiedesanges2024@gmail.com';

-- 3. Améliorer la fonction link_tenant_profile pour gérer les conflits
CREATE OR REPLACE FUNCTION public.link_tenant_profile(p_tenant_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  tenant_exists boolean;
  user_exists boolean;
  tenant_record record;
  existing_profile record;
BEGIN
  -- Log pour debugging
  RAISE NOTICE 'Attempting to link tenant % to user %', p_tenant_id, p_user_id;
  
  -- Vérifier que le tenant existe
  SELECT * FROM tenants WHERE id = p_tenant_id INTO tenant_record;
  tenant_exists := tenant_record IS NOT NULL;
  RAISE NOTICE 'Tenant exists: %, email: %', tenant_exists, tenant_record.email;
  
  -- Vérifier que l'utilisateur existe dans auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = p_user_id) INTO user_exists;
  RAISE NOTICE 'User exists: %', user_exists;
  
  -- Si les deux existent, faire la liaison
  IF tenant_exists AND user_exists THEN
    -- Vérifier si un profil existe déjà pour cet utilisateur
    SELECT * FROM profiles WHERE id = p_user_id INTO existing_profile;
    
    -- Mettre à jour le tenant avec le profile_id
    UPDATE tenants 
    SET tenant_profile_id = p_user_id,
        updated_at = now()
    WHERE id = p_tenant_id;
    
    RAISE NOTICE 'Updated tenant record with profile_id';
    
    -- Créer ou mettre à jour le profil
    IF existing_profile IS NOT NULL THEN
      -- Mettre à jour le profil existant
      UPDATE profiles SET 
        is_tenant_user = true,
        email = tenant_record.email,
        first_name = COALESCE(existing_profile.first_name, tenant_record.name),
        last_name = COALESCE(existing_profile.last_name, ''),
        updated_at = now()
      WHERE id = p_user_id;
      RAISE NOTICE 'Updated existing profile for user';
    ELSE
      -- Créer un nouveau profil
      INSERT INTO profiles (id, is_tenant_user, email, first_name, last_name)
      SELECT 
        p_user_id, 
        true,
        tenant_record.email,
        tenant_record.name,
        ''
      ON CONFLICT (id) 
      DO UPDATE SET 
        is_tenant_user = true,
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = now();
      RAISE NOTICE 'Created new profile for user';
    END IF;
    
    RETURN true;
  ELSE
    RAISE NOTICE 'Failed: tenant_exists=%, user_exists=%', tenant_exists, user_exists;
    RETURN false;
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error in link_tenant_profile: %', SQLERRM;
  RETURN false;
END;
$function$;

-- 4. Ajouter une contrainte d'unicité pour éviter les doublons d'email dans les tenants
ALTER TABLE tenants ADD CONSTRAINT unique_tenant_email UNIQUE (email);

-- 5. Supprimer les invitations en double pour cet email
DELETE FROM tenant_invitations 
WHERE email = 'academiedesanges2024@gmail.com' 
AND id NOT IN (
  SELECT id FROM tenant_invitations 
  WHERE email = 'academiedesanges2024@gmail.com' 
  ORDER BY created_at DESC 
  LIMIT 1
);
