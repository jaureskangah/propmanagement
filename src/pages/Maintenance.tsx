import React from "react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceHeader } from "@/components/maintenance/header/MaintenanceHeader";
import { MaintenanceMetricsSection } from "@/components/maintenance/metrics/MaintenanceMetricsSection";
import { MaintenanceTabs } from "@/components/maintenance/tabs/MaintenanceTabs";

// Fetch maintenance requests
const fetchMaintenanceRequests = async () => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*');
  
  if (error) throw error;
  return data;
};

const Maintenance = () => {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: fetchMaintenanceRequests,
  });

  // Calculate statistics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const resolvedRequests = requests.filter(r => r.status === 'Resolved').length;
  const urgentRequests = requests.filter(r => r.priority === 'Urgent').length;

  // Mock data for demonstration
  const mockFinancialData = {
    propertyId: "123e4567-e89b-12d3-a456-426614174000",
    expenses: [
      { category: "Utilities", amount: 500, date: "2024-03-01" },
      { category: "Insurance", amount: 300, date: "2024-03-05" },
    ],
    maintenance: [
      { description: "Plumbing repair", cost: 250, date: "2024-03-02" },
      { description: "HVAC maintenance", cost: 400, date: "2024-03-10" },
    ],
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 font-sans">
      <div className="mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Maintenance Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Track maintenance requests, schedule tasks, and manage vendor relationships
        </p>
      </div>
      
      <MaintenanceMetricsSection
        totalRequests={totalRequests}
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
        urgentRequests={urgentRequests}
      />

      <MaintenanceTabs 
        propertyId={mockFinancialData.propertyId}
        mockFinancialData={mockFinancialData}
      />
    </div>
  );
};

export default Maintenance;