import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FileText, MessageSquare, History, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import TenantProfile from "@/components/TenantProfile";

// Mock data - replace with real data when backend is integrated
const mockTenants = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    propertyId: "1",
    propertyName: "Maple Heights",
    unitNumber: "101",
    leaseStart: "2024-01-01",
    leaseEnd: "2024-12-31",
    rentAmount: 1500,
    documents: [
      { id: "1", name: "Lease Agreement", date: "2024-01-01" },
      { id: "2", name: "Background Check", date: "2023-12-15" },
    ],
    paymentHistory: [
      { id: "1", date: "2024-03-01", amount: 1500, status: "Paid" },
      { id: "2", date: "2024-02-01", amount: 1500, status: "Paid" },
    ],
    maintenanceRequests: [
      { id: "1", date: "2024-02-15", issue: "Leaking faucet", status: "Resolved" },
      { id: "2", date: "2024-03-10", issue: "AC not cooling", status: "In Progress" },
    ],
    communications: [
      { id: "1", date: "2024-03-15", type: "Email", subject: "Maintenance Request Follow-up" },
      { id: "2", date: "2024-03-01", type: "SMS", subject: "Rent Payment Reminder" },
    ],
  },
  // ... Add more mock tenants as needed
];

const Tenants = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("Rendering Tenants page");

  const filteredTenants = mockTenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenants..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTenants.map((tenant) => (
              <Card
                key={tenant.id}
                className={`cursor-pointer hover:bg-accent ${
                  selectedTenant === tenant.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedTenant(tenant.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        {tenant.propertyName} - Unit {tenant.unitNumber}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedTenant ? (
            <TenantProfile tenant={mockTenants.find(t => t.id === selectedTenant)!} />
          ) : (
            <Card className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Select a tenant to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tenants;