
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WorkOrder } from "@/types/workOrder";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useWorkOrdersData = () => {
  const { language } = useLocale();

  const translateStatus = (status: string): string => {
    if (language === 'fr') {
      switch (status) {
        case "Scheduled": return "Planifié";
        case "In Progress": return "En cours";
        case "Completed": return "Terminé";
        default: return status;
      }
    }
    return status;
  };

  const { data: workOrders = [], isLoading, refetch } = useQuery({
    queryKey: ['work-orders', language],
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
        unit: order.unit_number || undefined,
        status: translateStatus(order.status) // Traduire le statut ici
      }));
    },
  });

  return {
    workOrders,
    isLoading,
    refetch
  };
};
