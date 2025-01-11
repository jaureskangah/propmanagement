import { useMemo } from "react";
import { Communication } from "@/types/tenant";

export const useCommunicationsData = (
  communications: Communication[],
  searchQuery: string,
  selectedCategory: string | null,
  startDate: Date | null
) => {
  // Group communications by type
  const groupedCommunications = useMemo(() => {
    return communications.reduce((acc, comm) => {
      if (!acc[comm.type || 'other']) {
        acc[comm.type || 'other'] = [];
      }
      acc[comm.type || 'other'].push(comm);
      return acc;
    }, {} as Record<string, Communication[]>);
  }, [communications]);

  // Get unique communication types
  const communicationTypes = useMemo(() => {
    return Array.from(new Set(communications.map(comm => comm.type)));
  }, [communications]);

  // Filter communications based on search, category, and date
  const filteredCommunications = useMemo(() => {
    console.log("Filtering communications with category:", selectedCategory);
    let filtered = communications;

    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(comm => comm.category === selectedCategory);
      console.log("Filtered by category:", filtered);
    }

    if (startDate) {
      filtered = filtered.filter(comm => 
        new Date(comm.created_at) >= new Date(startDate)
      );
    }

    return filtered;
  }, [communications, searchQuery, selectedCategory, startDate]);

  return {
    groupedCommunications,
    communicationTypes,
    filteredCommunications
  };
};