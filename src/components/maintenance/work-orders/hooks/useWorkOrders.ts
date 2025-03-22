
import { useWorkOrdersData } from "./useWorkOrdersData";
import { useWorkOrderFilterState } from "./useWorkOrderFilterState";
import { useWorkOrderFiltering } from "./useWorkOrderFiltering";

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
  // Get raw work orders data
  const { workOrders, isLoading, refetch } = useWorkOrdersData();
  
  // Apply filtering and sorting
  const filteredAndSortedOrders = useWorkOrderFiltering(workOrders, {
    statusFilter,
    searchQuery,
    sortBy,
    dateRange,
    priorityFilter,
    vendorSearch
  });

  return {
    workOrders,
    isLoading,
    refetch,
    filteredAndSortedOrders
  };
};
