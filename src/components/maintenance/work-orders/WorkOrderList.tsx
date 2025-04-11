
import React from "react";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderHeader } from "./components/WorkOrderHeader";
import { WorkOrderFilters } from "./components/WorkOrderFilters";
import { WorkOrderGrid } from "./components/WorkOrderGrid";
import { useWorkOrderFilters } from "./hooks/useWorkOrderFilters";
import { useWorkOrdersData } from "./hooks/useWorkOrdersData";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  const { refetch } = useWorkOrdersData();
  
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredAndSortedOrders
  } = useWorkOrderFilters(workOrders);

  // Gérer les mises à jour d'ordre de travail
  const handleWorkOrderUpdate = () => {
    refetch();
  };

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

      <WorkOrderGrid 
        orders={filteredAndSortedOrders} 
        onOrderUpdate={handleWorkOrderUpdate}
      />
    </div>
  );
};
