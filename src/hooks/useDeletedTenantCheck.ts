import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useDeletedTenantCheck = () => {
  const { user, isTenant } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkDeletedTenant = async () => {
      if (!user) return;

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
          .select('is_tenant_user')
          .eq('id', user.id)
          .single();

        console.log("🔍 Profile check result:", profileData);
        console.log("🔍 Has properties:", !!propertiesData?.length);

        // Si marqué comme tenant, vérifier l'existence dans la table tenants
        if (profileData?.is_tenant_user) {
          const { data: tenantData } = await supabase
            .from('tenants')
            .select('id')
            .eq('tenant_profile_id', user.id)
            .maybeSingle();

          console.log("🔍 Tenant existence check:", !!tenantData);

          // Si pas de tenant trouvé = compte supprimé
          if (!tenantData) {
            console.log("🚨 DETECTED DELETED TENANT - FORCING SIGNOUT");
            await forceSignOut("Votre compte locataire a été supprimé. Veuillez demander une nouvelle invitation à votre propriétaire.");
            return;
          }
        }

        // Si pas marqué comme tenant ET pas de propriétés = compte invalide
        if (!profileData?.is_tenant_user && (!propertiesData || propertiesData.length === 0)) {
          console.log("🚨 DETECTED INVALID ACCOUNT - NO PROPERTIES AND NOT TENANT");
          await forceSignOut("Votre compte n'a pas accès à cette application. Veuillez contacter l'administrateur.");
          return;
        }

      } catch (error) {
        console.error("❌ Error in deleted tenant check:", error);
      }
    };

    const forceSignOut = async (message: string) => {
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
        title: "Accès refusé",
        description: message,
      });
      
      navigate('/auth');
    };

    // Exécuter la vérification immédiatement
    checkDeletedTenant();
  }, [user, navigate]);
};