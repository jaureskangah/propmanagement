import { useMemo } from "react";
import { Communication } from "@/types/tenant";

export const useCommunicationsData = (
  communications: Communication[],
  searchQuery: string,
  selectedType: string | null,
  startDate: Date | null
) => {
  // Group communications by type
  const groupedCommunications = useMemo(() => {
    return communications.reduce((acc, comm) => {
      if (!acc[comm.type]) {
        acc[comm.type] = [];
      }
      acc[comm.type].push(comm);
      return acc;
    }, {} as Record<string, Communication[]>);
  }, [communications]);

  // Get unique communication types
  const communicationTypes = useMemo(() => {
    return Array.from(new Set(communications.map(comm => comm.type)));
  }, [communications]);

  // Filter communications based on search, type, and date
  const filteredCommunications = useMemo(() => {
    let filtered = communications;

    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(comm => comm.type === selectedType);
    }

    if (startDate) {
      filtered = filtered.filter(comm => 
        new Date(comm.created_at) >= new Date(startDate)
      );
    }

    return filtered;
  }, [communications, searchQuery, selectedType, startDate]);

  return {
    groupedCommunications,
    communicationTypes,
    filteredCommunications
  };
};