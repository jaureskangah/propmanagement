import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { PreventiveMaintenance } from "@/components/maintenance/PreventiveMaintenance";
import { WorkOrderList } from "@/components/maintenance/WorkOrderList";
import { VendorList } from "@/components/maintenance/VendorList";
import { PropertyFinancials } from "@/components/maintenance/PropertyFinancials";
import { MaintenanceNotifications } from "@/components/maintenance/MaintenanceNotifications";

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

  const handleCreateWorkOrder = () => {
    console.log("Creating new work order");
  };

  const handleAddVendor = () => {
    console.log("Adding new vendor");
  };

  // Mock data for demonstration
  const mockFinancialData = {
    propertyId: "1",
    rentRoll: [
      { unit: "101", tenant: "John Doe", rent: 1200, status: "Current" },
      { unit: "102", tenant: "Jane Smith", rent: 1300, status: "Current" },
    ],
    expenses: [
      { category: "Utilities", amount: 500, date: "2024-03-01" },
      { category: "Insurance", amount: 300, date: "2024-03-05" },
    ],
    maintenance: [
      { description: "Plumbing repair", cost: 250, date: "2024-03-02" },
      { description: "HVAC maintenance", cost: 400, date: "2024-03-10" },
    ],
  };

  // Mock work orders data
  const mockWorkOrders = [
    {
      id: 1,
      title: "Plumbing Issue",
      property: "Property A",
      unit: "101",
      status: "En cours",
      vendor: "John's Plumbing",
      cost: 250,
    },
    {
      id: 2,
      title: "HVAC Maintenance",
      property: "Property B",
      unit: "202",
      status: "Planifié",
      vendor: "Cool Air Services",
      cost: 400,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Maintenance Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <MaintenanceMetrics
            totalRequests={totalRequests}
            pendingRequests={pendingRequests}
            resolvedRequests={resolvedRequests}
            urgentRequests={urgentRequests}
          />
        </div>
        <div className="lg:col-span-1">
          <MaintenanceNotifications />
        </div>
      </div>

      <Tabs defaultValue="preventive" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preventive">Maintenance Préventive</TabsTrigger>
          <TabsTrigger value="work-orders">Ordres de Travail</TabsTrigger>
          <TabsTrigger value="vendors">Prestataires</TabsTrigger>
          <TabsTrigger value="financials">Coûts</TabsTrigger>
        </TabsList>

        <TabsContent value="preventive">
          <PreventiveMaintenance />
        </TabsContent>

        <TabsContent value="work-orders">
          <WorkOrderList 
            workOrders={mockWorkOrders} 
            onCreateWorkOrder={handleCreateWorkOrder} 
          />
        </TabsContent>

        <TabsContent value="vendors">
          <VendorList onAddVendor={handleAddVendor} />
        </TabsContent>

        <TabsContent value="financials">
          <PropertyFinancials {...mockFinancialData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;