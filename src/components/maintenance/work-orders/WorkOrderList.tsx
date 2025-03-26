
import React from "react";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderHeader } from "./components/WorkOrderHeader";
import { WorkOrderFilters } from "./components/WorkOrderFilters";
import { WorkOrderGrid } from "./components/WorkOrderGrid";
import { useWorkOrderFilters } from "./hooks/useWorkOrderFilters";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredAndSortedOrders
  } = useWorkOrderFilters(workOrders);

  return (
    <div className="animate-fade-in space-y-6">
      <WorkOrderHeader onCreateWorkOrder={onCreateWorkOrder} />

      <WorkOrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <WorkOrderGrid orders={filteredAndSortedOrders} />
    </div>
  );
};
