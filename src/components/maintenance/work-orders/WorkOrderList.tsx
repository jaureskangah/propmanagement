
import React from "react";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderHeader } from "./components/WorkOrderHeader";
import { WorkOrderFilters } from "./components/WorkOrderFilters";
import { WorkOrderGrid } from "./components/WorkOrderGrid";
import { SavedFiltersMenu } from "./components/SavedFiltersMenu";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useWorkOrderFilterState } from "./hooks/useWorkOrderFilterState";
import { useWorkOrderFiltering } from "./hooks/useWorkOrderFiltering";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  const { t } = useLocale();
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    buildingFilter,
    setBuildingFilter,
    problemTypeFilter,
    setProblemTypeFilter,
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    deleteSavedFilter
  } = useWorkOrderFilterState();

  // Extract unique buildings and problem types for filters
  const buildings = Array.from(
    new Set(workOrders.map(order => order.property).filter(Boolean) as string[])
  );
  
  const problemTypes = [
    "Plumbing",
    "Electrical",
    "HVAC",
    "Structural",
    "Appliance",
    "Pest Control",
    "Landscaping"
  ];

  const filteredAndSortedOrders = useWorkOrderFiltering(workOrders, {
    statusFilter,
    searchQuery,
    sortBy,
    dateRange: { from: undefined, to: undefined },
    priorityFilter: "all",
    vendorSearch: "",
    buildingFilter,
    problemTypeFilter
  });

  const handleSaveFilter = (name: string) => {
    saveCurrentFilter(name);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <WorkOrderHeader onCreateWorkOrder={onCreateWorkOrder} />
        
        {savedFilters.length > 0 && (
          <SavedFiltersMenu
            savedFilters={savedFilters}
            onApplyFilter={applySavedFilter}
            onDeleteFilter={deleteSavedFilter}
          />
        )}
      </div>

      <WorkOrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        buildingFilter={buildingFilter}
        setBuildingFilter={setBuildingFilter}
        problemTypeFilter={problemTypeFilter}
        setProblemTypeFilter={setProblemTypeFilter}
        buildings={buildings}
        problemTypes={problemTypes}
        onSaveFilter={() => handleSaveFilter(searchQuery || `${t('filter')} ${savedFilters.length + 1}`)}
      />

      <WorkOrderGrid orders={filteredAndSortedOrders} />
    </div>
  );
};
