
-- Remplacer la fonction link_tenant_profile par une version améliorée
CREATE OR REPLACE FUNCTION public.link_tenant_profile(p_tenant_id uuid, p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  tenant_record record;
  user_record record;
  profile_record record;
  result jsonb;
BEGIN
  -- Initialiser le résultat par défaut
  result := jsonb_build_object(
    'success', false,
    'message', 'Unknown error',
    'details', jsonb_build_object()
  );

  -- Log de début
  RAISE NOTICE '[LINK_TENANT_PROFILE] Starting process for tenant_id: %, user_id: %', p_tenant_id, p_user_id;
  
  -- Validation des paramètres d'entrée
  IF p_tenant_id IS NULL THEN
    result := jsonb_build_object(
      'success', false,
      'message', 'Tenant ID is required',
      'error_code', 'MISSING_TENANT_ID'
    );
    RAISE NOTICE '[LINK_TENANT_PROFILE] Error: %', result->>'message';
    RETURN result;
  END IF;
  
  IF p_user_id IS NULL THEN
    result := jsonb_build_object(
      'success', false,
      'message', 'User ID is required',
      'error_code', 'MISSING_USER_ID'
    );
    RAISE NOTICE '[LINK_TENANT_PROFILE] Error: %', result->>'message';
    RETURN result;
  END IF;

  -- Vérifier que le tenant existe
  SELECT * FROM tenants WHERE id = p_tenant_id INTO tenant_record;
  
  IF tenant_record IS NULL THEN
    result := jsonb_build_object(
      'success', false,
      'message', 'Tenant not found',
      'error_code', 'TENANT_NOT_FOUND',
      'details', jsonb_build_object('tenant_id', p_tenant_id)
    );
    RAISE NOTICE '[LINK_TENANT_PROFILE] Error: %', result->>'message';
    RETURN result;
  END IF;
  
  RAISE NOTICE '[LINK_TENANT_PROFILE] Tenant found: % (%)', tenant_record.name, tenant_record.email;

  -- Vérifier que l'utilisateur existe dans auth.users
  SELECT id, email FROM auth.users WHERE id = p_user_id INTO user_record;
  
  IF user_record IS NULL THEN
    result := jsonb_build_object(
      'success', false,
      'message', 'User not found in auth system',
      'error_code', 'USER_NOT_FOUND',
      'details', jsonb_build_object('user_id', p_user_id)
    );
    RAISE NOTICE '[LINK_TENANT_PROFILE] Error: %', result->>'message';
    RETURN result;
  END IF;
  
  RAISE NOTICE '[LINK_TENANT_PROFILE] Auth user found: %', user_record.email;

  -- Vérifier que les emails correspondent
  IF LOWER(tenant_record.email) != LOWER(user_record.email) THEN
    result := jsonb_build_object(
      'success', false,
      'message', 'Email mismatch between tenant and auth user',
      'error_code', 'EMAIL_MISMATCH',
      'details', jsonb_build_object(
        'tenant_email', tenant_record.email,
        'auth_email', user_record.email
      )
    );
    RAISE NOTICE '[LINK_TENANT_PROFILE] Error: %', result->>'message';
    RETURN result;
  END IF;

  -- Vérifier si le tenant n'est pas déjà lié
  IF tenant_record.tenant_profile_id IS NOT NULL THEN
    -- Si c'est le même utilisateur, c'est OK
    IF tenant_record.tenant_profile_id = p_user_id THEN
      result := jsonb_build_object(
        'success', true,
        'message', 'Tenant already linked to this user',
        'warning', 'ALREADY_LINKED',
        'details', jsonb_build_object(
          'tenant_profile_id', tenant_record.tenant_profile_id
        )
      );
      RAISE NOTICE '[LINK_TENANT_PROFILE] Warning: %', result->>'message';
      RETURN result;
    ELSE
      -- Lié à un autre utilisateur - erreur
      result := jsonb_build_object(
        'success', false,
        'message', 'Tenant already linked to another user',
        'error_code', 'ALREADY_LINKED_OTHER_USER',
        'details', jsonb_build_object(
          'current_profile_id', tenant_record.tenant_profile_id,
          'requested_profile_id', p_user_id
        )
      );
      RAISE NOTICE '[LINK_TENANT_PROFILE] Error: %', result->>'message';
      RETURN result;
    END IF;
  END IF;

  -- Commencer la liaison
  BEGIN
    -- Étape 1: Mettre à jour le tenant avec le profile_id
    UPDATE tenants 
    SET tenant_profile_id = p_user_id,
        updated_at = now()
    WHERE id = p_tenant_id;
    
    RAISE NOTICE '[LINK_TENANT_PROFILE] Tenant updated with profile_id';

    -- Étape 2: Vérifier si un profil existe déjà
    SELECT * FROM profiles WHERE id = p_user_id INTO profile_record;
    
    IF profile_record IS NOT NULL THEN
      -- Mettre à jour le profil existant
      UPDATE profiles SET 
        is_tenant_user = true,
        email = COALESCE(user_record.email, profile_record.email),
        first_name = COALESCE(profile_record.first_name, tenant_record.name),
        last_name = COALESCE(profile_record.last_name, ''),
        updated_at = now()
      WHERE id = p_user_id;
      
      RAISE NOTICE '[LINK_TENANT_PROFILE] Updated existing profile';
    ELSE
      -- Créer un nouveau profil
      INSERT INTO profiles (id, is_tenant_user, email, first_name, last_name)
      VALUES (
        p_user_id, 
        true,
        user_record.email,
        tenant_record.name,
        ''
      )
      ON CONFLICT (id) 
      DO UPDATE SET 
        is_tenant_user = true,
        email = EXCLUDED.email,
        first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
        updated_at = now();
      
      RAISE NOTICE '[LINK_TENANT_PROFILE] Created/updated profile';
    END IF;

    -- Vérification finale que tout est correct
    SELECT tenant_profile_id FROM tenants WHERE id = p_tenant_id INTO tenant_record;
    SELECT is_tenant_user FROM profiles WHERE id = p_user_id INTO profile_record;
    
    IF tenant_record.tenant_profile_id = p_user_id AND profile_record.is_tenant_user = true THEN
      result := jsonb_build_object(
        'success', true,
        'message', 'Tenant profile linked successfully',
        'details', jsonb_build_object(
          'tenant_id', p_tenant_id,
          'user_id', p_user_id,
          'tenant_profile_id', tenant_record.tenant_profile_id,
          'is_tenant_user', profile_record.is_tenant_user
        )
      );
      RAISE NOTICE '[LINK_TENANT_PROFILE] Success: %', result->>'message';
    ELSE
      result := jsonb_build_object(
        'success', false,
        'message', 'Linking completed but verification failed',
        'error_code', 'VERIFICATION_FAILED',
        'details', jsonb_build_object(
          'expected_profile_id', p_user_id,
          'actual_profile_id', tenant_record.tenant_profile_id,
          'is_tenant_user', profile_record.is_tenant_user
        )
      );
      RAISE NOTICE '[LINK_TENANT_PROFILE] Error: %', result->>'message';
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- En cas d'erreur, nettoyer les changements partiels
    UPDATE tenants SET tenant_profile_id = NULL WHERE id = p_tenant_id AND tenant_profile_id = p_user_id;
    
    result := jsonb_build_object(
      'success', false,
      'message', 'Database error during linking process',
      'error_code', 'DATABASE_ERROR',
      'details', jsonb_build_object(
        'sql_error', SQLERRM,
        'sql_state', SQLSTATE
      )
    );
    RAISE NOTICE '[LINK_TENANT_PROFILE] Database error: %', SQLERRM;
  END;

  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'message', 'Unexpected error in link_tenant_profile',
    'error_code', 'FUNCTION_ERROR',
    'details', jsonb_build_object(
      'sql_error', SQLERRM,
      'sql_state', SQLSTATE
    )
  );
  RAISE NOTICE '[LINK_TENANT_PROFILE] Function error: %', SQLERRM;
  RETURN result;
END;
$function$;
