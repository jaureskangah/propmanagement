import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { PreventiveMaintenance } from "@/components/maintenance/PreventiveMaintenance";

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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Work Orders</h2>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Work Order
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{order.title}</CardTitle>
                    <Wrench className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Property:</strong> {order.property}</p>
                    <p><strong>Unit:</strong> {order.unit}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Vendor:</strong> {order.vendor}</p>
                    <p><strong>Cost:</strong> ${order.cost}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileImage className="h-4 w-4 mr-2" />
                        Photos
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Vendors</h2>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Specialty:</strong> {vendor.specialty}</p>
                    <p><strong>Phone:</strong> {vendor.phone}</p>
                    <p><strong>Email:</strong> {vendor.email}</p>
                    <p><strong>Rating:</strong> {vendor.rating}/5</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;
