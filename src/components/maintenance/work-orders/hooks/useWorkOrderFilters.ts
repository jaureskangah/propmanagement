
import { useState, useMemo } from "react";
import { WorkOrder } from "@/types/workOrder";

export const useWorkOrderFilters = (workOrders: WorkOrder[]) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");

  const filteredAndSortedOrders = useMemo(() => {
    if (!workOrders) return [];
    
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
          return (b.date || "").localeCompare(a.date || "");
        } else {
          return (b.cost || 0) - (a.cost || 0);
        }
      });
  }, [workOrders, statusFilter, searchQuery, sortBy]);

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredAndSortedOrders
  };
};
