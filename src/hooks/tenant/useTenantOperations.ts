
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export const useTenantOperations = (refetch: () => void, invalidateCache: () => void) => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddTenant = async (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to add a tenant",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("tenants").insert({
        ...data,
        user_id: user.id,
      });

      if (error) {
        throw error;
      }
      
      refetch();
      
      toast({
        title: "Success",
        description: "Tenant added successfully",
      });
    } catch (error: any) {
      console.error("Error adding tenant:", error);
      toast({
        title: "Error adding tenant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTenant = async (data: any) => {
    if (!selectedTenant) return;
    
    try {
      const { error } = await supabase
        .from("tenants")
        .update({
          ...data,
        })
        .eq("id", selectedTenant);
        
      if (error) {
        throw error;
      }
      
      refetch();
      
      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating tenant:", error);
      toast({
        title: "Error updating tenant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
      console.log("🏠 Property ID:", selectedTenantData.property_id);
      
      // ÉTAPE 1: Vérifier que le locataire existe encore
      console.log("🔍 ÉTAPE 1: Vérification existence du locataire...");
      const { data: tenantExists, error: existsError } = await supabase
        .from("tenants")
        .select("id, user_id, email, property_id")
        .eq("id", selectedTenantData.id)
        .single();
        
      if (existsError) {
        console.error("❌ Erreur lors de la vérification d'existence:", existsError);
        if (existsError.code === 'PGRST116') {
          console.log("✅ Le locataire n'existe plus - déjà supprimé");
          toast({
            title: "Information",
            description: "Le locataire a déjà été supprimé",
          });
          setSelectedTenant(null);
          invalidateCache();
          return;
        }
        throw new Error(`Impossible de vérifier l'existence du locataire: ${existsError.message}`);
      }
      
      if (!tenantExists) {
        console.log("✅ Locataire déjà supprimé");
        toast({
          title: "Information",
          description: "Le locataire a déjà été supprimé",
        });
        setSelectedTenant(null);
        invalidateCache();
        return;
      }
      
      console.log("✅ Locataire trouvé:", JSON.stringify(tenantExists));
      
      // ÉTAPE 2: Vérifier les permissions
      console.log("🔐 ÉTAPE 2: Vérification des permissions...");
      if (tenantExists.user_id !== user.id) {
        console.error("❌ Permission refusée - propriétaire différent");
        console.log("🔍 Tenant user_id:", tenantExists.user_id);
        console.log("🔍 Current user_id:", user.id);
        throw new Error("Vous n'avez pas les permissions pour supprimer ce locataire");
      }
      console.log("✅ Permissions validées");
      
      // ÉTAPE 3: Compter les invitations liées
      console.log("📨 ÉTAPE 3: Comptage des invitations liées...");
      const { count: invitationsCount, error: countError } = await supabase
        .from("tenant_invitations")
        .select("*", { count: 'exact', head: true })
        .eq("tenant_id", selectedTenantData.id);
        
      if (countError) {
        console.error("❌ Erreur lors du comptage des invitations:", countError);
      } else {
        console.log(`📊 Nombre d'invitations trouvées: ${invitationsCount || 0}`);
      }
      
      // ÉTAPE 4: Supprimer les invitations associées
      console.log("🗑️ ÉTAPE 4: Suppression des invitations...");
      const { error: invitationsError, data: deletedInvitations } = await supabase
        .from("tenant_invitations")
        .delete()
        .eq("tenant_id", selectedTenantData.id)
        .select();
        
      if (invitationsError) {
        console.error("❌ Erreur lors de la suppression des invitations:", invitationsError);
        throw new Error(`Erreur lors de la suppression des invitations: ${invitationsError.message}`);
      }
      
      console.log(`✅ ${deletedInvitations?.length || 0} invitations supprimées`);
      
      // ÉTAPE 5: Tentative de suppression du locataire
      console.log("🗑️ ÉTAPE 5: Suppression du locataire...");
      const { error: tenantError, data: deletedData } = await supabase
        .from("tenants")
        .delete()
        .eq("id", selectedTenantData.id)
        .eq("user_id", user.id) // Double vérification de sécurité
        .select();
        
      console.log("📊 Résultat de la suppression:");
      console.log("  - Error:", tenantError);
      console.log("  - Data:", deletedData);
      
      if (tenantError) {
        console.error("❌ Erreur lors de la suppression du locataire:", tenantError);
        console.log("🔍 Code d'erreur:", tenantError.code);
        console.log("🔍 Détails:", tenantError.details);
        console.log("🔍 Hint:", tenantError.hint);
        throw new Error(`Erreur lors de la suppression du locataire: ${tenantError.message}`);
      }
      
      console.log("📊 Nombre de locataires supprimés:", deletedData?.length || 0);
      
      if (!deletedData || deletedData.length === 0) {
        console.error("❌ Aucun locataire supprimé - problème de permissions RLS ou autre");
        
        // DIAGNOSTIC SUPPLÉMENTAIRE: Vérifier les politiques RLS
        console.log("🔍 DIAGNOSTIC: Vérification des permissions RLS...");
        const { data: rlsTest, error: rlsError } = await supabase
          .from("tenants")
          .select("id, user_id")
          .eq("id", selectedTenantData.id);
          
        console.log("🔍 Test RLS result:", rlsTest);
        console.log("🔍 Test RLS error:", rlsError);
        
        throw new Error("La suppression a échoué - aucune ligne affectée. Vérifiez les politiques RLS.");
      }
      
      console.log("🎉 ===== SUPPRESSION RÉUSSIE =====");
      
      // ÉTAPE 6: Nettoyage et actualisation
      console.log("🔄 ÉTAPE 6: Nettoyage et actualisation...");
      setSelectedTenant(null);
      
      // Forcer l'actualisation
      invalidateCache();
      await refetch();
      
      toast({
        title: "Succès",
        description: `Le locataire ${selectedTenantData.email} a été supprimé avec succès`,
      });
      
      // ÉTAPE 7: Vérification finale
      console.log("✅ ÉTAPE 7: Vérification finale...");
      setTimeout(async () => {
        const { data: finalCheck } = await supabase
          .from("tenants")
          .select("id")
          .eq("id", selectedTenantData.id);
        console.log("🔍 Vérification finale - locataire encore présent?", finalCheck?.length > 0 ? "OUI" : "NON");
      }, 1000);
      
    } catch (error: any) {
      console.error("💥 ===== ERREUR LORS DE LA SUPPRESSION =====", error);
      console.error("📝 Message d'erreur:", error.message);
      console.error("📝 Stack trace:", error.stack);
      toast({
        title: "Erreur lors de la suppression",
        description: error.message || "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  };

  return {
    selectedTenant,
    setSelectedTenant,
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant,
  };
};
