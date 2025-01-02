import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { PreventiveMaintenance } from "@/components/maintenance/PreventiveMaintenance";
import { WorkOrderList } from "@/components/maintenance/work-orders/WorkOrderList";
import { VendorList } from "@/components/maintenance/vendors/VendorList";
import { PropertyFinancials } from "@/components/maintenance/PropertyFinancials";
import { MaintenanceNotifications } from "@/components/maintenance/MaintenanceNotifications";
import { Calendar, ClipboardList, Users, DollarSign } from "lucide-react";

// Fetch maintenance requests
const fetchMaintenanceRequests = async () => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*');
  
  if (error) throw error;
  return data;
};

const Maintenance = () => {
  const { data: requests = [], isLoading, refetch } = useQuery({
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
        <TabsList className="w-full justify-start bg-background border-b p-0 h-auto">
          <TabsTrigger 
            value="preventive"
            className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200"
          >
            <Calendar className="h-4 w-4" />
            <span>Preventive Maintenance</span>
          </TabsTrigger>
          <TabsTrigger 
            value="work-orders"
            className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Work Orders</span>
          </TabsTrigger>
          <TabsTrigger 
            value="vendors"
            className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            <span>Vendors</span>
          </TabsTrigger>
          <TabsTrigger 
            value="financials"
            className="flex items-center gap-2 px-6 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none transition-all duration-200"
          >
            <DollarSign className="h-4 w-4" />
            <span>Costs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preventive" className="animate-fade-in">
          <PreventiveMaintenance />
        </TabsContent>

        <TabsContent value="work-orders" className="animate-fade-in">
          <WorkOrderList 
            propertyId={mockFinancialData.propertyId}
          />
        </TabsContent>

        <TabsContent value="vendors" className="animate-fade-in">
          <VendorList />
        </TabsContent>

        <TabsContent value="financials" className="animate-fade-in">
          <PropertyFinancials {...mockFinancialData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;