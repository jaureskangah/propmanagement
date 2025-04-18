
import React, { useState, useMemo } from "react";
import { WorkOrderHeader } from "./components/WorkOrderHeader";
import { WorkOrderFilters } from "./components/WorkOrderFilters";
import { WorkOrderGrid } from "./components/WorkOrderGrid";
import { WorkOrder } from "@/types/workOrder";
import { CreateWorkOrderDialog } from "./CreateWorkOrderDialog";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  // State for filters and search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost" | "priority">("date");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter and sort work orders
  const filteredAndSortedOrders = useMemo(() => {
    return workOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch = 
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.property && order.property.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return (b.date || "").localeCompare(a.date || "");
        } else if (sortBy === "cost") {
          return b.cost - a.cost;
        } else if (sortBy === "priority") {
          const priorityWeight = { "Haute": 3, "Moyenne": 2, "Basse": 1 };
          return (priorityWeight[b.priority as keyof typeof priorityWeight] || 0) - 
                 (priorityWeight[a.priority as keyof typeof priorityWeight] || 0);
        }
        return 0;
      });
  }, [workOrders, statusFilter, searchQuery, sortBy]);

  const handleCreateWorkOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Bouton de création d'ordre de travail cliqué");
    setIsCreateDialogOpen(true);
    onCreateWorkOrder(); // Call the parent handler if needed
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleWorkOrderCreated = () => {
    // This would typically trigger a refresh of the work orders list
    console.log("Work order created, refreshing list...");
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <WorkOrderHeader onCreateWorkOrder={handleCreateWorkOrder} />

      <WorkOrderFilters 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <WorkOrderGrid orders={filteredAndSortedOrders} />

      <CreateWorkOrderDialog
        isOpen={isCreateDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleWorkOrderCreated}
      />
    </div>
  );
};
