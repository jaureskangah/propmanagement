
import { useMemo } from "react";
import { WorkOrder } from "@/types/workOrder";
import { isWithinInterval, parseISO } from "date-fns";

export interface FilterOptions {
  statusFilter: string;
  searchQuery: string;
  sortBy: "date" | "cost" | "priority";
  dateRange: { from: Date | undefined; to: Date | undefined };
  priorityFilter: string;
  vendorSearch: string;
  buildingFilter: string;
  problemTypeFilter: string;
}

export const useWorkOrderFiltering = (workOrders: WorkOrder[], options: FilterOptions) => {
  const { 
    statusFilter, 
    searchQuery, 
    sortBy, 
    dateRange, 
    priorityFilter, 
    vendorSearch,
    buildingFilter,
    problemTypeFilter
  } = options;

  const filteredAndSortedOrders = useMemo(() => {
    return workOrders
      .filter((order) => {
        // Basic filters
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        
        // Global search - search in multiple fields
        const matchesSearch = !searchQuery || [
          order.title,
          order.description,
          order.property,
          order.vendor,
          order.status,
          order.unit
        ].some(field => field && field.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesVendor = 
          !vendorSearch || 
          order.vendor.toLowerCase().includes(vendorSearch.toLowerCase());
        
        const matchesPriority = 
          priorityFilter === "all" || 
          order.priority === priorityFilter;
        
        // New advanced filters
        const matchesBuilding = 
          buildingFilter === "all" || 
          (order.property && order.property === buildingFilter);
        
        const matchesProblemType = 
          problemTypeFilter === "all" || 
          (order.description && order.description.toLowerCase().includes(problemTypeFilter.toLowerCase()));
        
        // Date range filter
        let matchesDateRange = true;
        if (dateRange.from && dateRange.to && order.date) {
          try {
            const orderDate = parseISO(order.date);
            matchesDateRange = isWithinInterval(orderDate, {
              start: dateRange.from,
              end: dateRange.to
            });
          } catch (error) {
            console.error("Error parsing date:", error);
          }
        }

        return matchesStatus && matchesSearch && matchesVendor && 
               matchesPriority && matchesDateRange && 
               matchesBuilding && matchesProblemType;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date":
            return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
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
  }, [
    workOrders, 
    statusFilter, 
    searchQuery, 
    sortBy, 
    dateRange, 
    priorityFilter, 
    vendorSearch,
    buildingFilter,
    problemTypeFilter
  ]);

  return filteredAndSortedOrders;
};
