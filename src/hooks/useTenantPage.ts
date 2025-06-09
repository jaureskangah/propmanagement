
import { useTenantData } from "@/hooks/tenant/useTenantData";
import { useTenantOperations } from "@/hooks/tenant/useTenantOperations";
import { useTenantSearch } from "@/hooks/tenant/useTenantSearch";
import { useTenantModals } from "@/hooks/tenant/useTenantModals";
import { useTenantFiltering } from "@/hooks/tenant/useTenantFiltering";

export const useTenantPage = () => {
  const {
    tenants,
    isLoading,
    refetch,
    invalidateCache,
    getPropertyName,
    mapTenantData,
  } = useTenantData();

  const {
    selectedTenant,
    setSelectedTenant,
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant,
  } = useTenantOperations(refetch, invalidateCache);

  const {
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
  } = useTenantSearch();

  const {
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  } = useTenantModals();

  const { filterTenants } = useTenantFiltering(getPropertyName);

  const filteredTenants = tenants?.map(mapTenantData).filter((tenant) => 
    filterTenants(tenant, searchQuery, searchFilters)
  );
  
  const selectedTenantData = selectedTenant 
    ? filteredTenants?.find(tenant => tenant.id === selectedTenant) 
    : null;

  const handleDeleteTenantWithData = () => handleDeleteTenant(selectedTenantData);

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
    handleDeleteTenant: handleDeleteTenantWithData,
  };
};
