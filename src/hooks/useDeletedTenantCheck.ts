import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export const useDeletedTenantCheck = () => {
  const { user, isTenant } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkDeletedTenant = async () => {
      if (!user) return;

      console.log("🔍 DELETED TENANT CHECK - User:", user.email);

      try {
        // Vérifier rapidement si c'est un tenant supprimé
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_tenant_user')
          .eq('id', user.id)
          .single();

        console.log("🔍 Profile check result:", profileData);

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
            
            // Nettoyer le profil
            await supabase
              .from('profiles')
              .update({ is_tenant_user: false })
              .eq('id', user.id);

            // Forcer déconnexion
            await supabase.auth.signOut();
            
            alert("Votre compte locataire a été supprimé. Veuillez demander une nouvelle invitation à votre propriétaire.");
            navigate('/auth');
            return;
          }
        }

      } catch (error) {
        console.error("❌ Error in deleted tenant check:", error);
      }
    };

    // Exécuter la vérification immédiatement
    checkDeletedTenant();
  }, [user, navigate]);
};