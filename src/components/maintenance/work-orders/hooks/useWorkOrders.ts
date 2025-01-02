import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useMemo } from "react";
import { WorkOrder } from "@/types/workOrder";

interface UseWorkOrdersProps {
  statusFilter: string;
  searchQuery: string;
  sortBy: "date" | "cost";
}

export const useWorkOrders = ({ statusFilter, searchQuery, sortBy }: UseWorkOrdersProps) => {
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
          ),
          properties (
            name
          )
        `)
        .eq('user_id', userData.user.id);

      if (error) throw error;

      return orders.map(order => ({
        ...order,
        vendor: order.vendors?.name || 'Unknown Vendor',
        property: order.properties?.name || undefined,
        unit: order.unit_number || undefined // Assurez-vous que unit_number est correctement mappé
      }));
    },
  });

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
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          return (b.cost || 0) - (a.cost || 0);
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy]);

  return {
    workOrders,
    isLoading,
    refetch,
    filteredAndSortedOrders
  };
};