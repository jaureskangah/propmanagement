
import { useMemo } from "react";
import { WorkOrder } from "@/types/workOrder";

interface FilterOptions {
  statusFilter: string;
  searchQuery: string;
  sortBy: "date" | "cost" | "priority";
  dateRange: { from: Date | undefined; to: Date | undefined };
  priorityFilter: string;
  vendorSearch: string;
}

export const useWorkOrderFiltering = (workOrders: WorkOrder[], options: FilterOptions) => {
  const { statusFilter, searchQuery, sortBy, dateRange, priorityFilter, vendorSearch } = options;

  const filteredAndSortedOrders = useMemo(() => {
    // Limiter le nombre d'éléments traités à 500 pour éviter les problèmes de mémoire
    const limitedWorkOrders = workOrders.slice(0, 500);
    
    // Apply all filters in one pass to improve efficiency
    return limitedWorkOrders
      .filter((order) => {
        // Status filter
        if (statusFilter !== "all" && order.status !== statusFilter) {
          return false;
        }
        
        // Search filter (title or property)
        const searchTermLower = searchQuery.toLowerCase();
        if (
          searchQuery && 
          !order.title.toLowerCase().includes(searchTermLower) && 
          !(order.property && order.property.toLowerCase().includes(searchTermLower))
        ) {
          return false;
        }
        
        // Vendor filter
        if (
          vendorSearch && 
          !(order.vendor && order.vendor.toLowerCase().includes(vendorSearch.toLowerCase()))
        ) {
          return false;
        }
        
        // Priority filter
        if (priorityFilter !== "all" && order.priority !== priorityFilter) {
          return false;
        }
        
        // Date range filter
        if (dateRange.from && dateRange.to && order.date) {
          try {
            const orderDate = new Date(order.date);
            if (orderDate < dateRange.from || orderDate > dateRange.to) {
              return false;
            }
          } catch (error) {
            console.error("Date parsing error:", error);
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date": {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0); 
            return dateB.getTime() - dateA.getTime();
          }
          case "cost":
            return (b.cost || 0) - (a.cost || 0);
          case "priority": {
            const priorityWeight = { "Haute": 3, "Moyenne": 2, "Basse": 1 };
            return (
              (priorityWeight[b.priority as keyof typeof priorityWeight] || 0) - 
              (priorityWeight[a.priority as keyof typeof priorityWeight] || 0)
            );
          }
          default:
            return 0;
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy, dateRange, priorityFilter, vendorSearch]);

  return filteredAndSortedOrders;
};
