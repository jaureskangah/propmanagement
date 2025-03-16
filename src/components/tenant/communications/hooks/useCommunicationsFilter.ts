
import { useState, useEffect, useMemo } from "react";
import { Communication } from "@/types/tenant";

export const useCommunicationsFilter = (communications: Communication[]) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;

  // Filtered communications based on active filters
  const filteredCommunications = useMemo(() => {
    return communications.filter(comm => {
      // Text filter
      const textFilter = !searchTerm ||
        (comm.subject && comm.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (comm.content && comm.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Type filter
      const typeFilter = !selectedType || comm.category === selectedType;
      
      // Date filter
      const dateFilter = !selectedDate || 
        (new Date(comm.created_at).toDateString() === new Date(selectedDate).toDateString());
      
      // Tab filter
      let tabFilter = true;
      if (activeTab === "urgent") {
        tabFilter = comm.category === "urgent";
      } else if (activeTab === "unread") {
        tabFilter = comm.status === "unread";
      }
      
      return textFilter && typeFilter && dateFilter && tabFilter;
    });
  }, [communications, searchTerm, selectedType, selectedDate, activeTab]);

  // Group communications by type
  const groupedCommunications = useMemo(() => {
    const grouped: Record<string, Communication[]> = {};
    
    filteredCommunications.forEach(comm => {
      const type = comm.type || "message";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(comm);
    });
    
    return grouped;
  }, [filteredCommunications]);

  // Communications to display (limited or all)
  const displayedCommunications = useMemo(() => {
    if (showAll) {
      return filteredCommunications;
    }
    return filteredCommunications.slice(0, INITIAL_DISPLAY_COUNT);
  }, [filteredCommunications, showAll]);

  // Group the displayed communications
  const displayedGroupedCommunications = useMemo(() => {
    const grouped: Record<string, Communication[]> = {};
    
    displayedCommunications.forEach(comm => {
      const type = comm.type || "message";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(comm);
    });
    
    return grouped;
  }, [displayedCommunications]);

  // Reset filters when active tab changes
  useEffect(() => {
    setSearchTerm("");
    setSelectedType(null);
    setSelectedDate("");
    setShowAll(false);
  }, [activeTab]);

  // Metrics for badge counts
  const unreadCount = useMemo(() => {
    return communications.filter(comm => comm.status === "unread").length;
  }, [communications]);
  
  const urgentCount = useMemo(() => {
    return communications.filter(comm => comm.category === "urgent").length;
  }, [communications]);

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedDate,
    setSelectedDate,
    showAll,
    setShowAll,
    toggleShowAll: () => setShowAll(!showAll),
    filteredCommunications,
    groupedCommunications,
    displayedCommunications,
    displayedGroupedCommunications,
    unreadCount,
    urgentCount,
    INITIAL_DISPLAY_COUNT
  };
};
