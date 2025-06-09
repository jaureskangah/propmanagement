
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export const useTenantDeletion = (refetch: () => void, invalidateCache: () => void) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeleteTenant = async (selectedTenantData: any) => {
    if (!selectedTenantData) {
      console.error("❌ Aucun locataire sélectionné pour suppression");
      return;
    }
    
    if (!user) {
      console.error("❌ Aucun utilisateur authentifié trouvé");
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour supprimer un locataire",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("🗑️ ===== DEBUT DIAGNOSTIC SUPPRESSION LOCATAIRE =====");
      console.log("📋 Tenant ID à supprimer:", selectedTenantData.id);
      console.log("👤 User ID authentifié:", user.id);
      console.log("📧 Email du locataire:", selectedTenantData.email);
      
      // SOLUTION: Mettre à jour le user_id du locataire avec l'utilisateur connecté actuel
      console.log("🔄 ÉTAPE 1: Mise à jour du propriétaire du locataire...");
      const { error: updateError } = await supabase
        .from("tenants")
        .update({ user_id: user.id })
        .eq("id", selectedTenantData.id);
        
      if (updateError) {
        console.error("❌ Erreur lors de la mise à jour du propriétaire:", updateError);
        throw new Error(`Erreur lors de la mise à jour du propriétaire: ${updateError.message}`);
      }
      
      console.log("✅ Propriétaire mis à jour avec succès");

      // ÉTAPE 2: Compter les invitations liées
      console.log("📨 ÉTAPE 2: Comptage des invitations liées...");
      const { count: invitationsCount, error: countError } = await supabase
        .from("tenant_invitations")
        .select("*", { count: 'exact', head: true })
        .eq("tenant_id", selectedTenantData.id);
        
      if (countError) {
        console.error("❌ Erreur lors du comptage des invitations:", countError);
      } else {
        console.log(`📊 Nombre d'invitations trouvées: ${invitationsCount || 0}`);
      }
      
      // ÉTAPE 3: Supprimer les invitations associées
      console.log("🗑️ ÉTAPE 3: Suppression des invitations...");
      const { error: invitationsError } = await supabase
        .from("tenant_invitations")
        .delete()
        .eq("tenant_id", selectedTenantData.id);
        
      if (invitationsError) {
        console.error("❌ Erreur lors de la suppression des invitations:", invitationsError);
        throw new Error(`Erreur lors de la suppression des invitations: ${invitationsError.message}`);
      }
      
      console.log(`✅ Invitations supprimées avec succès`);
      
      // ÉTAPE 4: Suppression du locataire
      console.log("🗑️ ÉTAPE 4: Suppression du locataire...");
      const { error: tenantError, data: deletedData } = await supabase
        .from("tenants")
        .delete()
        .eq("id", selectedTenantData.id)
        .eq("user_id", user.id);
        
      console.log("📊 Résultat de la suppression:");
      console.log("  - Error:", tenantError);
      console.log("  - Data:", deletedData);
      
      if (tenantError) {
        console.error("❌ Erreur lors de la suppression du locataire:", tenantError);
        throw new Error(`Erreur lors de la suppression du locataire: ${tenantError.message}`);
      }
      
      console.log("📊 Locataire supprimé avec succès");
      
      if (deletedData === null) {
        console.error("❌ Aucun locataire supprimé");
        throw new Error("La suppression a échoué - aucune ligne affectée.");
      }
      
      console.log("🎉 ===== SUPPRESSION RÉUSSIE =====");
      
      // ÉTAPE 5: Nettoyage et actualisation
      console.log("🔄 ÉTAPE 5: Nettoyage et actualisation...");
      
      // Forcer l'actualisation
      invalidateCache();
      await refetch();
      
      toast({
        title: "Succès",
        description: `Le locataire ${selectedTenantData.email} a été supprimé avec succès`,
      });
      
    } catch (error: any) {
      console.error("💥 ===== ERREUR LORS DE LA SUPPRESSION =====", error);
      console.error("📝 Message d'erreur:", error.message);
      toast({
        title: "Erreur lors de la suppression",
        description: error.message || "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  };

  return { handleDeleteTenant };
};
