
import React from "react";
import { MaintenanceMetricsSection } from "./metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "./tabs/MaintenanceTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import MaintenancePageHeader from "./header/MaintenancePageHeader";
import { useMaintenancePage } from "./hooks/useMaintenancePage";
import { ActionButtons } from "./sections/ActionButtons";
import { MaintenanceDialogs } from "./sections/MaintenanceDialogs";
import { VendorList } from "./vendors/VendorList";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";

export const MaintenancePageContainer = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useLocale();
  
  const {
    requests,
    filteredRequests,
    showFilters,
    setShowFilters,
    searchQuery,
    setSearchQuery,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    selectedPropertyId,
    selectedYear,
    pendingRequests,
    resolvedRequests,
    urgentRequests,
    handleViewAllRequests,
    handleCreateTask,
    handleAddExpense,
    handleAddTaskFromDialog,
    handlePropertySelect,
    handleYearChange
  } = useMaintenancePage();

  return (
    <div className="space-y-6 font-sans">
      <MaintenancePageHeader 
        totalRequests={requests.length} 
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
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
      
      <ActionButtons 
        onCreateTask={handleCreateTask}
        onAddExpense={handleAddExpense}
      />

      <MaintenanceMetricsSection 
        totalRequests={requests.length} 
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
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
              navigate('/maintenance-requests');
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
        onCloseTaskDialog={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTaskFromDialog}
        isAddExpenseOpen={isAddExpenseOpen}
        onCloseExpenseDialog={() => setIsAddExpenseOpen(false)}
        propertyId={selectedPropertyId}
      />
    </div>
  );
};
