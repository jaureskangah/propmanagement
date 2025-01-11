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
      const type = comm.type || 'other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(comm);
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
      startDate: startDate?.toISOString()
    });

    let filtered = [...communications];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(comm => {
        // Get the raw category value
        const rawCategory = comm.category;
        
        // Convert to string and lowercase, defaulting to 'general' if undefined
        const commCategory = typeof rawCategory === 'string' 
          ? rawCategory.toLowerCase() 
          : typeof rawCategory === 'object' && rawCategory !== null
          ? (rawCategory as any).value?.toLowerCase() || 'general'
          : 'general';

        const selectedCategoryLower = selectedCategory.toLowerCase();
        
        console.log("Category comparison:", {
          id: comm.id,
          subject: comm.subject,
          rawCategory,
          commCategory,
          selectedCategory: selectedCategoryLower,
          matches: commCategory === selectedCategoryLower
        });
        
        return commCategory === selectedCategoryLower;
      });
      console.log("After category filter:", filtered.length);
    }

    // Date filter
    if (startDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);

      filtered = filtered.filter(comm => {
        const commDate = new Date(comm.created_at);
        console.log("Date comparison:", {
          commDate: commDate.toISOString(),
          startDate: startOfDay.toISOString(),
          isAfter: commDate >= startOfDay
        });
        return commDate >= startOfDay;
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