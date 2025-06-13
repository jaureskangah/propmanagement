
import { useState, useEffect } from "react";
import { useTenants } from "./useTenants";
import { useAddTenant } from "./useAddTenant";
import { useUpdateTenant } from "./useUpdateTenant";
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

  // Data hooks - corrected to use the actual return structure
  const { tenants, isLoading, addTenant, updateTenant, deleteTenant } = useTenants();

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
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit_number.toLowerCase().includes(searchQuery.toLowerCase());

    const propertyName = getPropertyName(tenant);
    const matchesProperty = !searchFilters.property || 
      propertyName.toLowerCase().includes(searchFilters.property.toLowerCase());

    const matchesRentRange = 
      tenant.rent_amount >= searchFilters.rentRange[0] &&
      tenant.rent_amount <= searchFilters.rentRange[1];

    return matchesSearch && matchesProperty && matchesRentRange;
  });

  // Handlers - using mutateAsync from the mutations
  const handleAddTenant = async (data: any) => {
    await addTenant.mutateAsync(data);
    setIsAddModalOpen(false);
  };

  const handleUpdateTenant = async (data: any) => {
    if (selectedTenant) {
      await updateTenant.mutateAsync({ id: selectedTenant, ...data });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteTenant = async () => {
    if (selectedTenant) {
      await deleteTenant.mutateAsync(selectedTenant);
      setIsDeleteDialogOpen(false);
      setSelectedTenant(null);
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
    tenants,
    isLoading,
    filteredTenants,
    selectedTenantData,
    
    // Actions
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant,
    handleInviteTenant,
  };
};
