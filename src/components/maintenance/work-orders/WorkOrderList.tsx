
import React from "react";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderHeader } from "./components/WorkOrderHeader";
import { WorkOrderFilters } from "./components/WorkOrderFilters";
import { WorkOrderGrid } from "./components/WorkOrderGrid";
import { useWorkOrderFilters } from "./hooks/useWorkOrderFilters";
import { useWorkOrdersData } from "./hooks/useWorkOrdersData";
import { CreateWorkOrderDialog } from "./CreateWorkOrderDialog";
import { useState } from "react";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  const { refetch } = useWorkOrdersData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
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

  const handleCreateWorkOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Ouvrir la boîte de dialogue de création");
    setIsCreateDialogOpen(true);
    onCreateWorkOrder();
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleWorkOrderCreated = () => {
    console.log("Ordre de travail créé, rafraîchissement de la liste...");
    refetch();
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <WorkOrderHeader onCreateWorkOrder={handleCreateWorkOrder} />

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

      <CreateWorkOrderDialog
        isOpen={isCreateDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleWorkOrderCreated}
      />
    </div>
  );
};
