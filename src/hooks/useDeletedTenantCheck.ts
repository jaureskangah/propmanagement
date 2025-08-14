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
          // Vérifier s'il y a une invitation en cours ou récemment acceptée (étendu à 10 minutes)
          const { data: recentInvitation } = await supabase
            .from('tenant_invitations')
            .select('id, status, created_at')
            .eq('email', user.email)
            .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()) // 10 minutes
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          console.log("🔍 Recent invitation check:", recentInvitation);

          // Si il y a une invitation récente (même expirée), donner plus de temps
          if (recentInvitation) {
            console.log("🔍 Recent invitation found - skipping deletion check");
            return;
          }

          // Vérifier si le profil a été créé récemment (étendu à 5 minutes)
          const profileCreatedAt = new Date(profileData.created_at);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          
          if (profileCreatedAt > fiveMinutesAgo) {
            console.log("🔍 Profile created recently - waiting for tenant linking process");
            return;
          }

          // Vérifier aussi les invitations acceptées récemment (dans les 30 dernières minutes)
          const { data: acceptedInvitation } = await supabase
            .from('tenant_invitations')
            .select('id, status, created_at')
            .eq('email', user.email)
            .eq('status', 'accepted')
            .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // 30 minutes
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          console.log("🔍 Recently accepted invitation check:", acceptedInvitation);

          if (acceptedInvitation) {
            console.log("🔍 Recently accepted invitation found - skipping deletion check");
            return;
          }

          const { data: tenantData } = await supabase
            .from('tenants')
            .select('id')
            .eq('tenant_profile_id', user.id)
            .maybeSingle();

          console.log("🔍 Tenant existence check:", !!tenantData);

          // DERNIÈRE VÉRIFICATION: si pas de tenant trouvé, vérifier s'il y a au moins une entrée tenant avec le même email
          if (!tenantData) {
            const { data: tenantByEmail } = await supabase
              .from('tenants')
              .select('id, tenant_profile_id')
              .eq('email', user.email)
              .maybeSingle();

            console.log("🔍 Tenant by email check:", tenantByEmail);

            // Si il y a un tenant avec le même email mais pas encore lié, ne pas déconnecter
            if (tenantByEmail && !tenantByEmail.tenant_profile_id) {
              console.log("🔍 Tenant exists but not linked yet - skipping deletion check");
              return;
            }

            // Seulement maintenant, si vraiment aucun tenant n'existe, considérer comme supprimé
            if (!tenantByEmail) {
              console.log("🚨 DETECTED DELETED TENANT - FORCING SIGNOUT");
              await forceSignOut(t('deletedTenantAccount'), 'accessDenied');
              return;
            }
          }
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