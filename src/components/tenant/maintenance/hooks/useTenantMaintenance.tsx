
import { useMaintenanceData } from "./useMaintenanceData";
import { useMaintenanceFilters } from "./useMaintenanceFilters";
import { useMaintenanceActions } from "./useMaintenanceActions";

export const useTenantMaintenance = () => {
  // Get maintenance data and stats
  const {
    requests,
    tenantId,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    fetchMaintenanceRequests
  } = useMaintenanceData();

  // Apply filters and sorting
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredRequests
  } = useMaintenanceFilters(requests);

  // Define actions for maintenance requests
  const {
    selectedRequest,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleViewDetails,
    handleDeleteMaintenance
  } = useMaintenanceActions(fetchMaintenanceRequests);

  return {
    // Data
    requests: filteredRequests,
    tenantId,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    
    // Filters and sorting
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    
    // UI state
    selectedRequest,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    
    // Actions
    handleMaintenanceUpdate: fetchMaintenanceRequests,
    handleDeleteMaintenance,
    handleViewDetails
  };
};
