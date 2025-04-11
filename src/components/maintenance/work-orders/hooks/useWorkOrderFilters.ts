
import { useState, useMemo } from 'react';
import { WorkOrder } from '@/types/workOrder';

export const useWorkOrderFilters = (workOrders: WorkOrder[]) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost" | "priority">("date");

  const filteredAndSortedOrders = useMemo(() => {
    return workOrders
      .filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch = 
          order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (order.property && order.property.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (order.vendor && order.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
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
