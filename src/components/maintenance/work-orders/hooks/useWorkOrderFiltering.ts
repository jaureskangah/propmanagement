
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
    // Hard limit to prevent memory issues (should be already limited by parent)
    const MAX_ITEMS = 100;
    const safeWorkOrders = Array.isArray(workOrders) ? workOrders : [];
    // Ensure we're working with a reasonable amount of data
    const limitedWorkOrders = safeWorkOrders.slice(0, MAX_ITEMS);
    
    // Create a simplified filter that will use less memory
    const filtered = limitedWorkOrders.filter((order) => {
      // Skip null or undefined orders to prevent crashes
      if (!order) return false;
      
      // Apply status filter if set
      if (statusFilter && statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }
      
      // Basic search on title and property with early returns
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = order.title && order.title.toLowerCase().includes(searchLower);
        const propertyMatch = order.property && order.property.toLowerCase().includes(searchLower);
        
        if (!titleMatch && !propertyMatch) {
          return false;
        }
      }
      
      // Vendor search
      if (vendorSearch && order.vendor) {
        if (!order.vendor.toLowerCase().includes(vendorSearch.toLowerCase())) {
          return false;
        }
      }
      
      // Priority filter
      if (priorityFilter && priorityFilter !== "all" && order.priority !== priorityFilter) {
        return false;
      }
      
      // Date filtering - only if both dates are set
      if (dateRange.from && dateRange.to && order.date) {
        try {
          const orderDate = new Date(order.date);
          if (orderDate < dateRange.from || orderDate > dateRange.to) {
            return false;
          }
        } catch (error) {
          // Fail silently and include the order if date parsing fails
          console.error("Date parsing error", error);
        }
      }
      
      // Include this order if it passed all filters
      return true;
    });

    // Basic memory-efficient sorting
    if (filtered.length > 0) {
      return filtered.sort((a, b) => {
        // Handle possibly undefined values safely
        if (!a || !b) return 0;
        
        switch (sortBy) {
          case "date": {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA; // Descending order
          }
          case "cost": {
            const costA = typeof a.cost === 'number' ? a.cost : 0;
            const costB = typeof b.cost === 'number' ? b.cost : 0;
            return costB - costA; // Descending order
          }
          case "priority": {
            // Simplify priority weights to consume less memory
            const getPriorityWeight = (priority: string): number => {
              if (priority === "Haute") return 3;
              if (priority === "Moyenne") return 2;
              if (priority === "Basse") return 1;
              return 0;
            };
            
            return getPriorityWeight(b.priority || "") - getPriorityWeight(a.priority || "");
          }
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  }, [workOrders, statusFilter, searchQuery, sortBy, dateRange, priorityFilter, vendorSearch]);

  return filteredAndSortedOrders;
};
