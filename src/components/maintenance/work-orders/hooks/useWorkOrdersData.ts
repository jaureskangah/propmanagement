
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WorkOrder } from "@/types/workOrder";

export const useWorkOrdersData = () => {
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
        unit: order.unit_number || undefined
      }));
    },
  });

  return {
    workOrders,
    isLoading,
    refetch
  };
};
