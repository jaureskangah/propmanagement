import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardMetric } from "@/components/DashboardMetric";
import { 
  Wrench, 
  Calendar, 
  Users, 
  FileImage, 
  DollarSign,
  Plus,
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HourglassIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

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

  const averageResolutionTime = () => {
    const resolvedReqs = requests.filter(r => r.status === 'Resolved');
    if (resolvedReqs.length === 0) return "N/A";
    
    const totalTime = resolvedReqs.reduce((acc, req) => {
      const created = new Date(req.created_at);
      const updated = new Date(req.updated_at);
      return acc + (updated.getTime() - created.getTime());
    }, 0);
    
    const avgDays = Math.round((totalTime / resolvedReqs.length) / (1000 * 60 * 60 * 24));
    return `${avgDays} days`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Maintenance Management</h1>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardMetric
          title="Total Requests"
          value={totalRequests.toString()}
          icon={<Wrench className="h-4 w-4 text-blue-500" />}
          description="All maintenance requests"
        />
        <DashboardMetric
          title="Pending Requests"
          value={pendingRequests.toString()}
          icon={<HourglassIcon className="h-4 w-4 text-yellow-500" />}
          description="Awaiting resolution"
        />
        <DashboardMetric
          title="Resolved Requests"
          value={resolvedRequests.toString()}
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          description="Completed maintenance tasks"
        />
        <DashboardMetric
          title="Urgent Issues"
          value={urgentRequests.toString()}
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          description="High priority requests"
        />
      </div>

      <Tabs defaultValue="work-orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="work-orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Work Orders</h2>
            <Button onClick={handleCreateWorkOrder} className="flex items-center gap-2">
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

        <TabsContent value="vendors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Vendors</h2>
            <Button onClick={handleAddVendor} className="flex items-center gap-2">
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

        <TabsContent value="scheduled" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Scheduled Maintenance</h2>
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Maintenance
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">No scheduled maintenance tasks.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;
