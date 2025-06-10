
-- Vérifier si la fonction existe et la recréer si nécessaire
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
BEGIN
  -- Log pour debugging
  RAISE NOTICE 'Attempting to link tenant % to user %', p_tenant_id, p_user_id;
  
  -- Vérifier que le tenant existe
  SELECT EXISTS(SELECT 1 FROM tenants WHERE id = p_tenant_id) INTO tenant_exists;
  RAISE NOTICE 'Tenant exists: %', tenant_exists;
  
  -- Vérifier que l'utilisateur existe dans auth.users
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = p_user_id) INTO user_exists;
  RAISE NOTICE 'User exists: %', user_exists;
  
  -- Si les deux existent, faire la liaison
  IF tenant_exists AND user_exists THEN
    -- Mettre à jour le tenant avec le profile_id
    UPDATE tenants 
    SET tenant_profile_id = p_user_id,
        updated_at = now()
    WHERE id = p_tenant_id;
    
    RAISE NOTICE 'Updated tenant record with profile_id';
    
    -- Mettre à jour ou créer le profil pour marquer l'utilisateur comme locataire
    INSERT INTO profiles (id, is_tenant_user, email, first_name, last_name)
    SELECT 
      p_user_id, 
      true,
      u.email,
      u.raw_user_meta_data->>'first_name',
      u.raw_user_meta_data->>'last_name'
    FROM auth.users u 
    WHERE u.id = p_user_id
    ON CONFLICT (id) 
    DO UPDATE SET 
      is_tenant_user = true,
      email = EXCLUDED.email,
      first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
      last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
    
    RAISE NOTICE 'Updated/created profile for user';
    
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
