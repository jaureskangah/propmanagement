
import React from "react";
import { MaintenanceMetricsSection } from "./metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "./tabs/MaintenanceTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import MaintenancePageHeader from "./header/MaintenancePageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/components/providers/LocaleProvider";
import { VendorList } from "./vendors/VendorList";
import { MaintenanceDialogs } from "./dialogs/MaintenanceDialogs";
import { useMaintenancePage } from "./hooks/useMaintenancePage";

export const MaintenancePageContainer = () => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  const {
    // State
    showFilters,
    setShowFilters,
    searchQuery, 
    setSearchQuery,
    selectedPropertyId,
    selectedYear,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    
    // Data
    requests,
    filteredRequests,
    urgentRequests,
    
    // Handlers
    handleViewAllRequests,
    handleCreateTask,
    handleAddTaskFromDialog,
    handlePropertySelect,
    handleYearChange,
  } = useMaintenancePage();

  return (
    <div className="space-y-6 font-sans">
      <MaintenancePageHeader 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r.status === "Pending").length}
        resolvedRequests={requests.filter(r => r.status === "Resolved").length}
        urgentRequests={urgentRequests}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        isMobile={isMobile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateTask={handleCreateTask}
        onPropertySelect={handlePropertySelect}
        onYearChange={handleYearChange}
        selectedPropertyId={selectedPropertyId}
        selectedYear={selectedYear}
      />

      <MaintenanceMetricsSection 
        totalRequests={requests.length} 
        pendingRequests={requests.filter(r => r.status === "Pending").length}
        resolvedRequests={requests.filter(r => r.status === "Resolved").length}
        urgentRequests={urgentRequests}
        propertyId={selectedPropertyId}
        selectedYear={selectedYear}
      />

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className={`w-full ${isMobile ? "flex flex-wrap" : "grid grid-cols-2"}`}>
          <TabsTrigger value="maintenance" className={`${isMobile ? "flex-1" : ""} font-sans text-sm`}>
            {t('maintenanceAndRepairs')}
          </TabsTrigger>
          <TabsTrigger value="vendors" className={`${isMobile ? "flex-1" : ""} font-sans text-sm`}>
            {t('vendors')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance" className="pt-4">
          <MaintenanceTabs 
            propertyId={selectedPropertyId} 
            selectedYear={selectedYear}
            filteredRequests={filteredRequests}
            onRequestClick={() => {
              // Navigate to the requests list instead of opening the dialog here
              handleViewAllRequests();
            }}
            onViewAllRequests={handleViewAllRequests}
          />
        </TabsContent>
        
        <TabsContent value="vendors" className="pt-4">
          <VendorList />
        </TabsContent>
      </Tabs>

      <MaintenanceDialogs
        isAddTaskOpen={isAddTaskOpen}
        onAddTaskClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTaskFromDialog}
        isAddExpenseOpen={isAddExpenseOpen}
        onAddExpenseClose={() => setIsAddExpenseOpen(false)}
        propertyId={selectedPropertyId}
      />
    </div>
  );
};
