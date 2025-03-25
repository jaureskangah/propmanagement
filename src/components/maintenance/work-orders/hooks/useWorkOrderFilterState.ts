
import { useState, useEffect } from "react";

export interface SavedFilter {
  id: string;
  name: string;
  statusFilter: string;
  buildingFilter: string;
  problemTypeFilter: string;
  sortBy: "date" | "cost" | "priority";
}

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
  
  // New advanced filters
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [problemTypeFilter, setProblemTypeFilter] = useState<string>("all");
  
  // Saved filters
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  // Load saved filters from localStorage on component mount
  useEffect(() => {
    const storedFilters = localStorage.getItem('workOrderSavedFilters');
    if (storedFilters) {
      try {
        setSavedFilters(JSON.parse(storedFilters));
      } catch (error) {
        console.error("Error loading saved filters:", error);
      }
    }
  }, []);

  // Save a new filter
  const saveCurrentFilter = (name: string) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name,
      statusFilter,
      buildingFilter,
      problemTypeFilter,
      sortBy
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    
    // Save to localStorage
    localStorage.setItem('workOrderSavedFilters', JSON.stringify(updatedFilters));
  };

  // Apply a saved filter
  const applySavedFilter = (filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (!filter) return;
    
    setStatusFilter(filter.statusFilter);
    setBuildingFilter(filter.buildingFilter);
    setProblemTypeFilter(filter.problemTypeFilter);
    setSortBy(filter.sortBy);
  };

  // Delete a saved filter
  const deleteSavedFilter = (filterId: string) => {
    const updatedFilters = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updatedFilters);
    localStorage.setItem('workOrderSavedFilters', JSON.stringify(updatedFilters));
  };

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
    setVendorSearch,
    buildingFilter,
    setBuildingFilter,
    problemTypeFilter,
    setProblemTypeFilter,
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    deleteSavedFilter
  };
};
