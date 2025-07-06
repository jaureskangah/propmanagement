
import { useState, useEffect } from "react";
import { useTenants } from "./useTenants";
import { useDeleteTenant } from "./useDeleteTenant";
import type { Tenant } from "@/types/tenant";

export interface SearchFilters {
  property: string;
  status: string;
  rentRange: [number, number];
  propertyId: string;
  leaseStatus: string;
}

export const useTenantPage = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    property: "",
    status: "",
    rentRange: [0, 5000],
    propertyId: "",
    leaseStatus: "",
  });
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // Data hooks
  const { tenants, isLoading, addTenant, updateTenant } = useTenants();
  const deleteTenantMutation = useDeleteTenant();

  // Computed values
  const selectedTenantData = tenants?.find((t: Tenant) => t.id === selectedTenant) || null;

  // Helper function to get property name safely
  const getPropertyName = (tenant: Tenant): string => {
    if (!tenant.properties) return "";
    if (Array.isArray(tenant.properties)) {
      return tenant.properties[0]?.name || "";
    }
    return tenant.properties.name || "";
  };

  // Filter tenants based on search query and filters
  const filteredTenants = tenants?.filter((tenant: Tenant) => {
    console.log("=== FILTERING TENANT ===");
    console.log("Tenant:", tenant.name, "Property ID:", tenant.property_id);
    console.log("Search filters:", searchFilters);
    
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit_number.toLowerCase().includes(searchQuery.toLowerCase());

    console.log("Matches search:", matchesSearch);

    // Amélioration du filtrage par propriété
    let matchesProperty = true;
    
    if (searchFilters.propertyId) {
      // Filtrage principal par ID de propriété (plus fiable)
      matchesProperty = tenant.property_id === searchFilters.propertyId;
      console.log("Filtering by propertyId:", searchFilters.propertyId, "matches:", matchesProperty);
    } else if (searchFilters.property) {
      // Fallback : filtrage par nom de propriété
      const propertyName = getPropertyName(tenant);
      matchesProperty = propertyName.toLowerCase().includes(searchFilters.property.toLowerCase());
      console.log("Filtering by property name:", searchFilters.property, "tenant property:", propertyName, "matches:", matchesProperty);
    }

    const matchesRentRange = 
      tenant.rent_amount >= searchFilters.rentRange[0] &&
      tenant.rent_amount <= searchFilters.rentRange[1];

    console.log("Matches rent range:", matchesRentRange);
    console.log("Final result:", matchesSearch && matchesProperty && matchesRentRange);
    console.log("=== END FILTERING ===");

    return matchesSearch && matchesProperty && matchesRentRange;
  });

  // Handlers
  const handleAddTenant = async (data: any): Promise<void> => {
    try {
      await addTenant.mutateAsync(data);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding tenant:", error);
      throw error;
    }
  };

  const handleUpdateTenant = async (data: any): Promise<void> => {
    if (selectedTenant) {
      try {
        await updateTenant.mutateAsync({ id: selectedTenant, ...data });
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating tenant:", error);
        throw error;
      }
    }
  };

  const handleDeleteTenant = async (): Promise<void> => {
    if (selectedTenant) {
      try {
        console.log("Initiating tenant deletion for:", selectedTenant);
        await deleteTenantMutation.mutateAsync(selectedTenant);
        setIsDeleteDialogOpen(false);
        setSelectedTenant(null);
      } catch (error) {
        console.error("Error deleting tenant:", error);
        throw error;
      }
    }
  };

  const handleInviteTenant = (tenantId: string) => {
    setSelectedTenant(tenantId);
    setIsInviteDialogOpen(true);
  };

  return {
    // State
    selectedTenant,
    setSelectedTenant,
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    
    // Modal states
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    
    // Data
    tenants: tenants || [],
    isLoading,
    filteredTenants: filteredTenants || [],
    selectedTenantData,
    
    // Actions
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant,
    handleInviteTenant,
    
    // Delete state
    isDeleting: deleteTenantMutation.isPending,
  };
};
