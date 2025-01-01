import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wrench, FileImage, CheckSquare, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MaintenanceMetrics } from "@/components/maintenance/MaintenanceMetrics";
import { PreventiveMaintenance } from "@/components/maintenance/PreventiveMaintenance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

// Mock data for vendors
const vendors = [
  {
    id: 1,
    name: "Plomberie Express",
    specialty: "Plomberie",
    phone: "514-555-0123",
    email: "contact@plomberieexpress.com",
    rating: 4.5,
  },
  {
    id: 2,
    name: "ClimaPro",
    specialty: "HVAC",
    phone: "514-555-0124",
    email: "service@climapro.com",
    rating: 4.8,
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ordres de Travail</h2>
            <Button onClick={handleCreateWorkOrder} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer un Ordre
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
                    <p><strong>Propriété:</strong> {order.property}</p>
                    <p><strong>Unité:</strong> {order.unit}</p>
                    <p><strong>Statut:</strong> {order.status}</p>
                    <p><strong>Prestataire:</strong> {order.vendor}</p>
                    <p><strong>Coût:</strong> {order.cost}€</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileImage className="h-4 w-4 mr-2" />
                        Photos
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Mettre à jour
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prestataires</h2>
            <Button onClick={handleAddVendor} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un Prestataire
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
                    <p><strong>Spécialité:</strong> {vendor.specialty}</p>
                    <p><strong>Téléphone:</strong> {vendor.phone}</p>
                    <p><strong>Email:</strong> {vendor.email}</p>
                    <p><strong>Note:</strong> {vendor.rating}/5</p>
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