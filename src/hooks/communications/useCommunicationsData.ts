
import { useMemo } from "react";
import { Communication } from "@/types/tenant";
import { startOfDay, parseISO, isAfter, isSameDay } from "date-fns";

export const useCommunicationsData = (
  communications: Communication[],
  searchQuery: string,
  selectedType: string | null,
  selectedDate: string | null
) => {
  // Group communications by type
  const groupedCommunications = useMemo(() => {
    // Sort communications by date (newest first)
    const sortedCommunications = [...communications].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return sortedCommunications.reduce((acc, comm) => {
      if (!comm) return acc;
      
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

  // Get unique communication categories
  const communicationCategories = useMemo(() => {
    return Array.from(new Set(communications.map(comm => comm.category).filter(Boolean)));
  }, [communications]);

  // Count unread communications
  const unreadCount = useMemo(() => {
    return communications.filter(comm => comm.status === 'unread').length;
  }, [communications]);

  // Filter communications based on search, category and date
  const filteredCommunications = useMemo(() => {
    console.log("Starting filtering with:", {
      total: communications.length,
      searchQuery,
      selectedType,
      selectedDate
    });

    let filtered = [...communications].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(comm => comm.type === selectedType);
      console.log("After type filter:", filtered.length);
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(comm => {
        const commDate = parseISO(comm.created_at);
        return isSameDay(commDate, parseISO(selectedDate));
      });
      console.log("After date filter:", filtered.length);
    }

    return filtered;
  }, [communications, searchQuery, selectedType, selectedDate]);

  return {
    groupedCommunications,
    communicationTypes,
    communicationCategories,
    filteredCommunications,
    unreadCount
  };
};
