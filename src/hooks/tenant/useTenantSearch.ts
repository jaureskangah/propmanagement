
import { useState } from "react";
import { SearchFilters } from "@/components/tenant/TenantSearch";

export const useTenantSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    propertyId: null,
    leaseStatus: "all",
  });

  return {
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
  };
};
