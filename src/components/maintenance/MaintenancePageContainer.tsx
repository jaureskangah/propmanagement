
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceMetricsSection } from "./metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "./tabs/MaintenanceTabs";
import MaintenancePageHeader from "./header/MaintenancePageHeader";
import MaintenanceFiltersSection from "./filters/MaintenanceFiltersSection";
import { AddTaskDialog } from "./AddTaskDialog";
import { MaintenanceRequestDialog } from "./request/MaintenanceRequestDialog";
import { MaintenanceRequest, NewTask } from "./types";
import { mockFinancialData } from "./mocks/financialData";
import { MAINTENANCE_STATUSES, MAINTENANCE_PRIORITIES, useMaintenanceRequests } from "./hooks/useMaintenanceRequests";
import { MaintenanceCharts } from "./charts/MaintenanceCharts";

export const MaintenancePageContainer = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(true);
  
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

  const handleViewRequest = (request: MaintenanceRequest) => {
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

  const handleCreateTask = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleAddTask = (task: NewTask) => {
    console.log("Adding task:", task);
    toast({
      title: t('success'),
      description: t('taskAdded'),
    });
    refetch();
    setIsAddTaskDialogOpen(false);
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
      
      {showCharts && (
        <div className="mb-6">
          <MaintenanceCharts propertyId={mockFinancialData.propertyId} />
        </div>
      )}
      
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

      {selectedRequest && (
        <MaintenanceRequestDialog
          request={selectedRequest}
          onClose={handleCloseRequestDialog}
          onUpdateSuccess={refetch}
        />
      )}
    </>
  );
};
