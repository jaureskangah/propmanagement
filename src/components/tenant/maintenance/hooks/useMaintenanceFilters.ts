
import { useState, useMemo } from "react";
import { MaintenanceRequest } from "@/types/tenant";

export const useMaintenanceFilters = (requests: MaintenanceRequest[]) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");
  
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesSearch = searchQuery === "" || 
        request.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    }).sort((a, b) => {
      console.log("Sorting requests with method:", sortBy);
      
      if (sortBy === "newest") {
        // Compare dates properly with new Date()
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
        // Use fallback to Medium if priority not found
        const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? priorityOrder.Medium;
        const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? priorityOrder.Medium;
        return priorityA - priorityB;
      }
      return 0;
    });
  }, [requests, statusFilter, searchQuery, sortBy]);

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredRequests
  };
};
