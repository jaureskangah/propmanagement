
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
    // Hard limit the number of processed items to prevent memory issues
    const MAX_ITEMS = 200;
    const limitedWorkOrders = workOrders.slice(0, MAX_ITEMS);
    
    // Create a single filter function to process all conditions in one pass
    const filtered = limitedWorkOrders.filter((order) => {
      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }
      
      // Search filter (title or property)
      if (searchQuery) {
        const searchTermLower = searchQuery.toLowerCase();
        const titleMatch = order.title?.toLowerCase().includes(searchTermLower);
        const propertyMatch = order.property?.toLowerCase().includes(searchTermLower);
        
        if (!titleMatch && !propertyMatch) {
          return false;
        }
      }
      
      // Vendor filter
      if (vendorSearch && order.vendor) {
        if (!order.vendor.toLowerCase().includes(vendorSearch.toLowerCase())) {
          return false;
        }
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
    });

    // Sort the filtered results
    return filtered.sort((a, b) => {
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
