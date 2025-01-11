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
    console.log("Starting filtering with:", {
      total: communications.length,
      searchQuery,
      selectedCategory,
      startDate
    });

    let filtered = [...communications];

    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    if (selectedCategory) {
      filtered = filtered.filter(comm => {
        const commCategory = comm.category?.toLowerCase() || '';
        const selectedCat = selectedCategory.toLowerCase();
        console.log(`Comparing categories: ${commCategory} === ${selectedCat}`);
        return commCategory === selectedCat;
      });
      console.log("After category filter:", filtered.length);
    }

    if (startDate) {
      filtered = filtered.filter(comm => {
        const commDate = new Date(comm.created_at);
        const filterDate = new Date(startDate);
        filterDate.setHours(0, 0, 0, 0); // Reset time to start of day
        console.log(`Comparing dates: ${commDate} >= ${filterDate}`);
        return commDate >= filterDate;
      });
      console.log("After date filter:", filtered.length);
    }

    return filtered;
  }, [communications, searchQuery, selectedCategory, startDate]);

  return {
    groupedCommunications,
    communicationTypes,
    filteredCommunications
  };
};