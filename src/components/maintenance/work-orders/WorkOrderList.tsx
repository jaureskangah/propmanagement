
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
  const [sortBy, setSortBy] = useState<"date" | "cost" | "priority">("date");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [vendorSearch, setVendorSearch] = useState("");
  const { toast } = useToast();

  const { 
    workOrders, 
    isLoading, 
    refetch,
    filteredAndSortedOrders 
  } = useWorkOrders({
    statusFilter,
    searchQuery,
    sortBy,
    dateRange,
    priorityFilter,
    vendorSearch
  });

  const handleCreateSuccess = () => {
    refetch();
    setIsCreateDialogOpen(false);
    toast({
      title: "Bon de travail créé",
      description: "Le bon de travail a été créé avec succès",
    });
  };

  const handleUpdate = () => {
    refetch();
  };

  const handleDelete = () => {
    refetch();
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Bons de travail</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Créer un bon
        </Button>
      </div>

      <WorkOrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        vendorSearch={vendorSearch}
        setVendorSearch={setVendorSearch}
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
