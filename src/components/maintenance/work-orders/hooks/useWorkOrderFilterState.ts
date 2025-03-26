
import { useState } from "react";

export const useWorkOrderFilterState = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "cost" | "priority">("date");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [vendorSearch, setVendorSearch] = useState("");

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    dateRange,
    setDateRange,
    priorityFilter,
    setPriorityFilter,
    vendorSearch,
    setVendorSearch
  };
};
