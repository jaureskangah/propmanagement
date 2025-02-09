
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useMemo } from "react";
import { WorkOrder } from "@/types/workOrder";
import { isWithinInterval, parseISO } from "date-fns";

interface UseWorkOrdersProps {
  statusFilter: string;
  searchQuery: string;
  sortBy: "date" | "cost" | "priority";
  dateRange: { from: Date | undefined; to: Date | undefined };
  priorityFilter: string;
  vendorSearch: string;
}

export const useWorkOrders = ({ 
  statusFilter, 
  searchQuery, 
  sortBy,
  dateRange,
  priorityFilter,
  vendorSearch
}: UseWorkOrdersProps) => {
  const { data: workOrders = [], isLoading, refetch } = useQuery({
    queryKey: ['work-orders'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      console.log("Fetching work orders with filters:", {
        statusFilter,
        searchQuery,
        sortBy,
        dateRange,
        priorityFilter,
        vendorSearch
      });

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

  const filteredAndSortedOrders = useMemo(() => {
    return workOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch = 
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.property?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVendor = 
          !vendorSearch || 
          order.vendor.toLowerCase().includes(vendorSearch.toLowerCase());
        const matchesPriority = 
          priorityFilter === "all" || 
          order.priority === priorityFilter;
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange.from && dateRange.to) {
          const orderDate = parseISO(order.date);
          matchesDateRange = isWithinInterval(orderDate, {
            start: dateRange.from,
            end: dateRange.to
          });
        }

        return matchesStatus && matchesSearch && matchesVendor && matchesPriority && matchesDateRange;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case "cost":
            return (b.cost || 0) - (a.cost || 0);
          case "priority": {
            const priorityWeight = { "Haute": 3, "Moyenne": 2, "Basse": 1 };
            return (priorityWeight[b.priority as keyof typeof priorityWeight] || 0) - 
                   (priorityWeight[a.priority as keyof typeof priorityWeight] || 0);
          }
          default:
            return 0;
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy, dateRange, priorityFilter, vendorSearch]);

  return {
    workOrders,
    isLoading,
    refetch,
    filteredAndSortedOrders
  };
};
