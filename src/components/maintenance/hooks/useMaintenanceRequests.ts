
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceRequest } from "@/components/maintenance/types";

export const MAINTENANCE_STATUSES = [
  "All",
  "Pending",
  "In Progress",
  "Resolved"
] as const;

export const MAINTENANCE_PRIORITIES = [
  "All",
  "Low",
  "Medium",
  "High",
  "Urgent"
] as const;

const fetchMaintenanceRequests = async () => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select(`
      *,
      tenants (
        id,
        name,
        unit_number,
        properties (
          name
        )
      )
    `);
  
  if (error) throw error;
  return data;
};

export function useMaintenanceRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    data: requests = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: fetchMaintenanceRequests,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get('request');
    
    if (requestId) {
      // Find the request matching the ID
      const request = requests.find(req => req.id === requestId);
      if (request) {
        setSelectedRequest(request);
      }
      
      const maintenanceSection = document.getElementById('maintenance-section');
      if (maintenanceSection) {
        maintenanceSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [requests]);

  const filteredRequests = requests.filter(request => {
    const statusMatch = selectedStatus === "All" || request.status === selectedStatus;
    const priorityMatch = selectedPriority === "All" || request.priority === selectedPriority;
    const searchMatch = searchQuery === "" || 
      request.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const resolvedRequests = requests.filter(r => r.status === 'Resolved').length;
  const urgentRequests = requests.filter(r => r.priority === 'Urgent').length;

  return {
    requests,
    filteredRequests,
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedRequest,
    setSelectedRequest,
    showFilters,
    setShowFilters,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    urgentRequests
  };
}
