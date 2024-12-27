import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Wrench, 
  Calendar, 
  Users, 
  FileImage, 
  DollarSign,
  Plus,
  CheckSquare
} from "lucide-react";

// Mock data - replace with real data when backend is integrated
const initialWorkOrders = [
  {
    id: "1",
    title: "Fix Leaking Faucet",
    property: "Maple Heights",
    unit: "101",
    status: "pending",
    priority: "medium",
    description: "Kitchen faucet is leaking",
    vendor: "Plumbing Pro",
    cost: 150,
    photos: [],
    createdAt: "2024-03-20",
  },
];

const initialVendors = [
  {
    id: "1",
    name: "Plumbing Pro",
    specialty: "Plumbing",
    phone: "555-0123",
    email: "contact@plumbingpro.com",
    rating: 4.5,
  },
];

const Maintenance = () => {
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [vendors, setVendors] = useState(initialVendors);
  const [selectedTab, setSelectedTab] = useState("work-orders");

  console.log("Rendering Maintenance page");

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