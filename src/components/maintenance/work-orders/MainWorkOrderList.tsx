
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
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter and sort work orders
  const filteredAndSortedOrders = useMemo(() => {
    return workOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch = 
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.property?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return (b.date || "").localeCompare(a.date || "");
        } else {
          return b.cost - a.cost;
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy]);

  const handleCreateWorkOrder = () => {
    setIsCreateDialogOpen(true);
    onCreateWorkOrder(); // Call the parent handler if needed
  };

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleWorkOrderCreated = () => {
    // This would typically trigger a refresh of the work orders list
    console.log("Work order created, refreshing list...");
  };

  return (
    <>
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
    </>
  );
};
