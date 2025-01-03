import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkOrderCard } from "./WorkOrderCard";
import { WorkOrderFilters } from "./WorkOrderFilters";
import { CreateWorkOrderDialog } from "./CreateWorkOrderDialog";
import { useToast } from "@/hooks/use-toast";
import { useWorkOrders } from "./hooks/useWorkOrders";

interface WorkOrderListProps {
  propertyId: string;
}

export const WorkOrderList = ({ propertyId }: WorkOrderListProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { 
    workOrders, 
    isLoading, 
    refetch,
    filteredAndSortedOrders 
  } = useWorkOrders({
    statusFilter,
    searchQuery,
    sortBy
  });

  const handleCreateSuccess = () => {
    refetch();
    setIsCreateDialogOpen(false);
    toast({
      title: "Work order created",
      description: "The work order has been created successfully",
    });
  };

  const handleUpdate = () => {
    refetch();
  };

  const handleDelete = () => {
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Work Orders</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Order
        </Button>
      </div>

      <WorkOrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedOrders.map((order) => (
          <WorkOrderCard 
            key={order.id} 
            order={order}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CreateWorkOrderDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        propertyId={propertyId}
      />
    </>
  );
};