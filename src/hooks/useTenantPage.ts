import { useState } from "react";
import { useQueryCache } from "@/hooks/useQueryCache";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";
import { SearchFilters } from "@/components/tenant/TenantSearch";

export const useTenantPage = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    propertyId: null,
    leaseStatus: "all",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to get property name safely
  const getPropertyName = (tenant: any): string => {
    if (!tenant.properties) {
      return '';
    }
    
    console.log("getPropertyName - properties data:", tenant.properties);
    console.log("getPropertyName - properties type:", typeof tenant.properties);
    
    if (typeof tenant.properties === 'object' && !Array.isArray(tenant.properties) && tenant.properties !== null) {
      if ('name' in tenant.properties && typeof tenant.properties.name === 'string') {
        console.log("getPropertyName - Found name in object:", tenant.properties.name);
        return tenant.properties.name;
      }
    }
    
    if (Array.isArray(tenant.properties) && tenant.properties.length > 0) {
      const firstProperty = tenant.properties[0];
      if (typeof firstProperty === 'object' && firstProperty !== null && 'name' in firstProperty) {
        console.log("getPropertyName - Found name in array:", firstProperty.name);
        return firstProperty.name;
      }
    }
    
    return '';
  };

  const { data: tenants, isLoading, refetch, invalidateCache } = useQueryCache<any[]>(
    ["tenants"],
    async () => {
      console.log("Fetching tenants data with cache optimization...");
      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          properties:property_id (
            name
          ),
          tenant_documents (
            id,
            name,
            created_at
          ),
          tenant_payments (
            id,
            amount,
            status,
            payment_date,
            created_at
          ),
          maintenance_requests (
            id,
            issue,
            status,
            created_at
          ),
          tenant_communications (
            id,
            type,
            subject,
            created_at
          )
        `);

      if (error) {
        console.error("Error fetching tenants:", error);
        toast({
          title: "Error fetching tenants",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Tenants data fetched successfully with cache:", data?.length || 0);
      console.log("Sample tenant properties structure:", data && data.length > 0 ? JSON.stringify(data[0].properties) : "No tenants");
      return data || [];
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(`Loaded ${data?.length || 0} tenants from cache or fresh fetch`);
      }
    }
  );

  const mapTenantData = (tenant: any): Tenant => ({
    ...tenant,
    documents: tenant.tenant_documents || [],
    paymentHistory: tenant.tenant_payments || [],
    maintenanceRequests: tenant.maintenance_requests || [],
    communications: tenant.tenant_communications || [],
  });

  const filterTenants = (tenant: Tenant) => {
    const propertyName = getPropertyName(tenant);
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (propertyName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const today = new Date();
    const leaseEnd = new Date(tenant.lease_end);
    const monthsUntilEnd = (leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

    switch (searchFilters.leaseStatus) {
      case "active":
        return leaseEnd > today && monthsUntilEnd > 2;
      case "expiring":
        return leaseEnd > today && monthsUntilEnd <= 2;
      case "expired":
        return leaseEnd < today;
      default:
        return true;
    }
  };

  const filteredTenants = tenants?.map(mapTenantData).filter(filterTenants);
  const selectedTenantData = selectedTenant 
    ? filteredTenants?.find(tenant => tenant.id === selectedTenant) 
    : null;

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
    if (!selectedTenantData) return;
    
    try {
      const { error } = await supabase
        .from("tenants")
        .update({
          ...data,
        })
        .eq("id", selectedTenantData.id);
        
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

  const handleDeleteTenant = async () => {
    if (!selectedTenantData) return;
    
    if (!user) {
      console.error("No authenticated user found");
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour supprimer un locataire",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("=== DEBUT SUPPRESSION LOCATAIRE ===");
      console.log("Tenant ID à supprimer:", selectedTenantData.id);
      console.log("User ID authentifié:", user.id);
      console.log("Email du locataire:", selectedTenantData.email);
      
      // Vérifier que le locataire appartient bien à l'utilisateur connecté
      const { data: tenantCheck, error: checkError } = await supabase
        .from("tenants")
        .select("id, user_id, email")
        .eq("id", selectedTenantData.id)
        .single();
        
      if (checkError) {
        console.error("Erreur lors de la vérification du locataire:", checkError);
        throw new Error(`Impossible de vérifier le locataire: ${checkError.message}`);
      }
      
      if (!tenantCheck) {
        console.error("Locataire non trouvé dans la base de données");
        throw new Error("Le locataire n'existe pas ou a déjà été supprimé");
      }
      
      if (tenantCheck.user_id !== user.id) {
        console.error("Permission refusée - le locataire n'appartient pas à l'utilisateur");
        console.log("Tenant user_id:", tenantCheck.user_id);
        console.log("Current user_id:", user.id);
        throw new Error("Vous n'avez pas les permissions pour supprimer ce locataire");
      }
      
      console.log("Vérifications de sécurité passées, suppression des invitations...");
      
      // Supprimer les invitations associées
      const { error: invitationsError, count: invitationsCount } = await supabase
        .from("tenant_invitations")
        .delete()
        .eq("tenant_id", selectedTenantData.id)
        .select();
        
      if (invitationsError) {
        console.error("Erreur lors de la suppression des invitations:", invitationsError);
        throw new Error(`Erreur lors de la suppression des invitations: ${invitationsError.message}`);
      }
      
      console.log(`${invitationsCount || 0} invitations supprimées`);
      
      // Supprimer le locataire avec vérification du nombre de lignes affectées
      console.log("Suppression du locataire...");
      const { error: tenantError, count: deletedCount } = await supabase
        .from("tenants")
        .delete()
        .eq("id", selectedTenantData.id)
        .eq("user_id", user.id) // Double vérification de sécurité
        .select();
        
      if (tenantError) {
        console.error("Erreur lors de la suppression du locataire:", tenantError);
        throw new Error(`Erreur lors de la suppression du locataire: ${tenantError.message}`);
      }
      
      console.log("Nombre de locataires supprimés:", deletedCount);
      
      if (!deletedCount || deletedCount === 0) {
        console.error("Aucun locataire n'a été supprimé - possible problème de permissions RLS");
        throw new Error("La suppression a échoué - aucune ligne affectée. Vérifiez vos permissions.");
      }
      
      console.log("=== SUPPRESSION RÉUSSIE ===");
      
      // Fermer les modales immédiatement
      setSelectedTenant(null);
      setIsDeleteDialogOpen(false);
      
      // Invalider le cache et forcer un refresh
      console.log("Invalidation du cache et refresh des données...");
      invalidateCache();
      await refetch();
      
      toast({
        title: "Succès",
        description: `Le locataire ${selectedTenantData.email} a été supprimé avec succès`,
      });
      
    } catch (error: any) {
      console.error("=== ERREUR LORS DE LA SUPPRESSION ===", error);
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
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    tenants,
    isLoading,
    filteredTenants,
    selectedTenantData,
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant,
  };
};
