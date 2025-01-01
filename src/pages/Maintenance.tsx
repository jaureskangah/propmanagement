import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { PreventiveMaintenance } from "@/components/maintenance/PreventiveMaintenance";
import { WorkOrderList } from "@/components/maintenance/WorkOrderList";
import { VendorList } from "@/components/maintenance/VendorList";

// Mock data for work orders
const workOrders = [
  {
    id: 1,
    title: "Réparation Plomberie",
    property: "Résidence A",
    unit: "101",
    status: "En cours",
    vendor: "Plomberie Express",
    cost: 250,
  },
  {
    id: 2,
    title: "Maintenance HVAC",
    property: "Résidence B",
    unit: "202",
    status: "Planifié",
    vendor: "ClimaPro",
    cost: 350,
  },
];

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
    // Implement work order creation logic
  };

  const handleAddVendor = () => {
    console.log("Adding new vendor");
    // Implement vendor addition logic
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Maintenance Management</h1>

      <MaintenanceMetrics
        totalRequests={totalRequests}
        pendingRequests={pendingRequests}
        resolvedRequests={resolvedRequests}
        urgentRequests={urgentRequests}
      />

      <Tabs defaultValue="preventive" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preventive">Maintenance Préventive</TabsTrigger>
          <TabsTrigger value="work-orders">Ordres de Travail</TabsTrigger>
          <TabsTrigger value="vendors">Prestataires</TabsTrigger>
        </TabsList>

        <TabsContent value="preventive">
          <PreventiveMaintenance />
        </TabsContent>

        <TabsContent value="work-orders">
          <WorkOrderList 
            workOrders={workOrders} 
            onCreateWorkOrder={handleCreateWorkOrder} 
          />
        </TabsContent>

        <TabsContent value="vendors">
          <VendorList onAddVendor={handleAddVendor} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;