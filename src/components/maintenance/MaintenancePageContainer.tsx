
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MaintenanceMetricsSection } from "./metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "./tabs/MaintenanceTabs";
import MaintenancePageHeader from "./header/MaintenancePageHeader";
import MaintenanceFiltersSection from "./filters/MaintenanceFiltersSection";
import { AddTaskDialog } from "./AddTaskDialog";
import { RequestDialogContainer } from "./request/RequestDialogContainer";
import { mockFinancialData } from "./mocks/financialData";
import { MAINTENANCE_STATUSES, MAINTENANCE_PRIORITIES, useMaintenanceRequests } from "./hooks/useMaintenanceRequests";
import { useAddTaskDialog } from "./hooks/useAddTaskDialog";

export const MaintenancePageContainer = () => {
  const isMobile = useIsMobile();
  
  const {
    filteredRequests,
    refetch,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedRequest,
    setSelectedRequest,
    showFilters,
    setShowFilters,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    urgentRequests
  } = useMaintenanceRequests();

  const {
    isAddTaskDialogOpen,
    setIsAddTaskDialogOpen,
    handleCreateTask,
    handleAddTask
  } = useAddTaskDialog(refetch);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseRequestDialog = () => {
    setSelectedRequest(null);
    // Clean up URL if needed
    if (window.location.search.includes('request=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('request');
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <>
      <MaintenancePageHeader
        totalRequests={totalRequests}
        pendingRequests={pendingRequests}
        urgentRequests={urgentRequests}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isMobile={isMobile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateTask={handleCreateTask}
      />
      
      <MaintenanceFiltersSection
        showFilters={showFilters}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        statuses={MAINTENANCE_STATUSES}
        priorities={MAINTENANCE_PRIORITIES}
      />
      
      <MaintenanceMetricsSection
        totalRequests={totalRequests}
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
        urgentRequests={urgentRequests}
      />
      
      <div id="maintenance-section">
        <MaintenanceTabs 
          propertyId={mockFinancialData.propertyId}
          mockFinancialData={mockFinancialData}
          filteredRequests={filteredRequests}
          onRequestClick={handleViewRequest}
        />
      </div>

      <AddTaskDialog 
        onAddTask={handleAddTask}
        isOpen={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
      />

      <RequestDialogContainer
        selectedRequest={selectedRequest}
        onClose={handleCloseRequestDialog}
        onUpdateSuccess={refetch}
      />
    </>
  );
};
