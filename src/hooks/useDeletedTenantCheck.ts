import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useToastTranslations } from '@/hooks/useToastTranslations';

export const useDeletedTenantCheck = () => {
  const { user, isTenant } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, translations } = useToastTranslations();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const checkDeletedTenant = async () => {
      if (!user || isProcessingRef.current) return;
      isProcessingRef.current = true;

      console.log("🔍 DELETED TENANT CHECK - User:", user.email);
      console.log("🔍 Current isTenant status:", isTenant);

      try {
        // Vérifier d'abord si l'utilisateur a un rôle admin
        const { data: adminRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        // Si l'utilisateur est admin, il a accès à tout - pas besoin de vérifications
        if (adminRole) {
          console.log("🔍 User is admin - skipping tenant/property checks");
          return;
        }

        // Vérifier si l'utilisateur a des propriétés (pour confirmer qu'il est propriétaire)
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        // Vérifier le profil utilisateur
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_tenant_user, created_at')
          .eq('id', user.id)
          .single();

        console.log("🔍 Profile check result:", profileData);
        console.log("🔍 Has properties:", !!propertiesData?.length);

        // Si marqué comme tenant, vérifier l'existence dans la table tenants
        if (profileData?.is_tenant_user) {
          // PRIORITÉ 1: Vérifier d'abord si un tenant existe avec ce tenant_profile_id
          const { data: linkedTenant } = await supabase
            .from('tenants')
            .select('id, tenant_profile_id')
            .eq('tenant_profile_id', user.id)
            .maybeSingle();

          console.log("🔍 Linked tenant check:", !!linkedTenant);

          // Si un tenant est lié avec ce profile_id, c'est valide - pas besoin d'autres vérifications
          if (linkedTenant) {
            console.log("🔍 Valid linked tenant found - account is legitimate");
            return;
          }

          // PRIORITÉ 2: Vérifier si le profil a été créé récemment (période de grâce étendue à 10 minutes)
          const profileCreatedAt = new Date(profileData.created_at);
          const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
          
          if (profileCreatedAt > tenMinutesAgo) {
            console.log("🔍 Profile created recently - extended grace period");
            return;
          }

          // PRIORITÉ 3: Vérifier s'il y a un tenant avec le même email (pas encore lié)
          const { data: tenantByEmail } = await supabase
            .from('tenants')
            .select('id, tenant_profile_id, email')
            .eq('email', user.email)
            .maybeSingle();

          console.log("🔍 Tenant by email check:", tenantByEmail);

          if (tenantByEmail) {
            console.log("🔍 Tenant exists by email - account is legitimate");
            return;
          }

          // PRIORITÉ 4: Vérifier s'il y a une invitation valide (pending ou récemment créée)
          const { data: validInvitation } = await supabase
            .from('tenant_invitations')
            .select('id, status, created_at, expires_at')
            .eq('email', user.email)
            .or('status.eq.pending,status.eq.accepted')
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          console.log("🔍 Valid invitation check:", validInvitation);

          if (validInvitation) {
            console.log("🔍 Valid invitation found - allowing access");
            return;
          }

          // PRIORITÉ 5: Vérifier les invitations récentes même si expirées (période de grâce)
          const { data: recentInvitation } = await supabase
            .from('tenant_invitations')
            .select('id, status, created_at')
            .eq('email', user.email)
            .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()) // 15 minutes
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          console.log("🔍 Recent invitation check:", recentInvitation);

          if (recentInvitation) {
            console.log("🔍 Recent invitation found - grace period active");
            return;
          }

          // Si aucune condition n'est remplie, alors le compte a été supprimé
          console.log("🚨 DETECTED DELETED TENANT - FORCING SIGNOUT");
          await forceSignOut(t('deletedTenantAccount'), 'accessDenied');
          return;
        }

        // NOTE: Ne pas forcer la déconnexion si pas de propriétés ET pas tenant
        // Un nouveau propriétaire peut ne pas encore avoir créé de propriétés
        // Cette vérification était trop agressive et causait des déconnexions incorrectes
        console.log("🔍 Valid account - checks passed");

      } catch (error) {
        console.error("❌ Error in deleted tenant check:", error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    const forceSignOut = async (message: string, titleKey: keyof typeof translations = 'accessDenied') => {
      // Nettoyer le profil
      await supabase
        .from('profiles')
        .update({ is_tenant_user: false })
        .eq('id', user.id);

      // Forcer déconnexion
      await supabase.auth.signOut();
      
      // Afficher un toast élégant
      toast({
        variant: "destructive",
        title: t(titleKey),
        description: message,
      });
      
      navigate('/auth');
    };

    // Retarder l'exécution de la vérification de 3 secondes pour laisser le temps à l'auth de se stabiliser
    const timeoutId = setTimeout(() => {
      checkDeletedTenant();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [user, navigate]);
};