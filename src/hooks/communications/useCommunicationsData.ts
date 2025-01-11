import { useMemo } from "react";
import { Communication } from "@/types/tenant";
import { startOfDay, parseISO } from "date-fns";

export const useCommunicationsData = (
  communications: Communication[],
  searchQuery: string,
  selectedCategory: string | null,
  startDate: Date | null
) => {
  // Group communications by type
  const groupedCommunications = useMemo(() => {
    // Trier d'abord les communications par date de création (du plus récent au moins récent)
    const sortedCommunications = [...communications].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return sortedCommunications.reduce((acc, comm) => {
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

  // Filter communications based on search and date
  const filteredCommunications = useMemo(() => {
    console.log("Starting filtering with:", {
      total: communications.length,
      searchQuery,
      startDate: startDate?.toISOString()
    });

    let filtered = [...communications].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    // Date filter
    if (startDate) {
      const filterStartOfDay = startOfDay(startDate);

      filtered = filtered.filter(comm => {
        const commDate = parseISO(comm.created_at);
        const commStartOfDay = startOfDay(commDate);
        const isAfter = commStartOfDay >= filterStartOfDay;

        console.log("Date comparison:", {
          commDate: commDate.toISOString(),
          commStartOfDay: commStartOfDay.toISOString(),
          filterStartOfDay: filterStartOfDay.toISOString(),
          isAfter
        });

        return isAfter;
      });
      console.log("After date filter:", filtered.length);
    }

    return filtered;
  }, [communications, searchQuery, startDate]);

  return {
    groupedCommunications,
    communicationTypes,
    filteredCommunications
  };
};