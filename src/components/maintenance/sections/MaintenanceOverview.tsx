
import React from "react";
import { MaintenanceMetricsSection } from "../metrics/MaintenanceMetricsSection";
import { MaintenanceCharts } from "../charts/MaintenanceCharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const MaintenanceOverview = () => {
  // Get saved property and year from localStorage or use defaults
  const savedPropertyId = localStorage.getItem('selectedPropertyId') || "property-1";
  const savedYear = localStorage.getItem('selectedYear') ? 
    parseInt(localStorage.getItem('selectedYear') || '') : new Date().getFullYear();

  // Fetch maintenance requests for metrics
  const { data: requests = [] } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const totalRequests = requests.length;
  // Updated to handle both 'Pending' and 'pending' variants
  const pendingRequests = requests.filter(r => 
    r.status === "Pending" || r.status === "pending"
  ).length;
  const resolvedRequests = requests.filter(r => r.status === "Resolved").length;
  const urgentRequests = requests.filter(r => r.priority === "Urgent").length;

  return (
    <div className="space-y-6">
      <MaintenanceMetricsSection 
        totalRequests={totalRequests}
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
        urgentRequests={urgentRequests}
        propertyId={savedPropertyId}
        selectedYear={savedYear}
      />
      
      <MaintenanceCharts 
        propertyId={savedPropertyId} 
        selectedYear={savedYear} 
      />
    </div>
  );
};
