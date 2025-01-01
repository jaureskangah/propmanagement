import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkOrderCard } from "./WorkOrderCard";
import { WorkOrderFilters } from "./WorkOrderFilters";
import { CreateWorkOrderDialog } from "./CreateWorkOrderDialog";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder } from "@/types/workOrder";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface WorkOrderListProps {
  propertyId: string;
}

export const WorkOrderList = ({ propertyId }: WorkOrderListProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: workOrders = [], isLoading, refetch } = useQuery({
    queryKey: ['work-orders'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data: orders, error } = await supabase
        .from('vendor_interventions')
        .select(`
          *,
          vendors (
            name
          )
        `)
        .eq('user_id', userData.user.id);

      if (error) throw error;

      return orders.map(order => ({
        ...order,
        vendor: order.vendors?.name || 'Unknown Vendor'
      }));
    },
  });

  // Filter and sort work orders
  const filteredAndSortedOrders = useMemo(() => {
    return workOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch = 
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          return (b.cost || 0) - (a.cost || 0);
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy]);

  const handleCreateSuccess = () => {
    refetch();
    setIsCreateDialogOpen(false);
    toast({
      title: "Ordre de travail créé",
      description: "L'ordre de travail a été créé avec succès",
    });
  };

  const handleUpdate = () => {
    refetch();
  };

  const handleDelete = () => {
    refetch();
  };

  const handleDuplicate = () => {
    refetch();
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ordres de Travail</h2>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Créer un Ordre
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
            onDuplicate={handleDuplicate}
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