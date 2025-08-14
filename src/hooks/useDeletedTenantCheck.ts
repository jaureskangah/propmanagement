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
          // Vérifier s'il y a une invitation en cours ou récemment acceptée
          const { data: recentInvitation } = await supabase
            .from('tenant_invitations')
            .select('id, status, created_at')
            .eq('email', user.email)
            .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // 5 minutes
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          console.log("🔍 Recent invitation check:", recentInvitation);

          // Si il y a une invitation récente, donner plus de temps pour le processus de liaison
          if (recentInvitation) {
            console.log("🔍 Recent invitation found - skipping deletion check");
            return;
          }

          // Vérifier si le profil a été créé récemment (moins de 2 minutes)
          const profileCreatedAt = new Date(profileData.created_at);
          const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
          
          if (profileCreatedAt > twoMinutesAgo) {
            console.log("🔍 Profile created recently - waiting for tenant linking process");
            return;
          }

          const { data: tenantData } = await supabase
            .from('tenants')
            .select('id')
            .eq('tenant_profile_id', user.id)
            .maybeSingle();

          console.log("🔍 Tenant existence check:", !!tenantData);

          // Si pas de tenant trouvé ET pas d'invitation récente ET profil pas récent = compte supprimé
          if (!tenantData) {
            console.log("🚨 DETECTED DELETED TENANT - FORCING SIGNOUT");
            await forceSignOut(t('deletedTenantAccount'), 'accessDenied');
            return;
          }
        }

        // NOTE: Ne pas forcer la déconnexion si pas de propriétés ET pas tenant
        // Un nouveau propriétaire peut ne pas encore avoir créé de propriétés
        // Cette vérification était trop agressive et causait des déconnexions incorrectes
        console.log("🔍 Valid property owner account (may not have properties yet)");

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

    // Exécuter la vérification immédiatement
    checkDeletedTenant();
  }, [user, navigate]);
};