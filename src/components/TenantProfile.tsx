import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantHeader } from "./tenant/TenantHeader";
import { TenantDocuments } from "./tenant/TenantDocuments";
import { TenantPayments } from "./tenant/TenantPayments";
import { TenantMaintenance } from "./tenant/TenantMaintenance";
import { TenantCommunications } from "./tenant/TenantCommunications";
import { Card } from "@/components/ui/card";
import type { Tenant } from "@/types/tenant";
import { useQueryClient } from "@tanstack/react-query";

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  const queryClient = useQueryClient();

  if (!tenant) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No tenant selected</p>
      </Card>
    );
  }

  const handleDataUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
  };

  console.log("Rendering TenantProfile for:", tenant.name);

  return (
    <div className="space-y-6">
      <TenantHeader tenant={tenant} />

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          <TenantDocuments 
            documents={tenant.documents} 
            tenantId={tenant.id}
            onDocumentUpdate={handleDataUpdate}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <TenantPayments 
            payments={tenant.paymentHistory} 
            tenantId={tenant.id}
            onPaymentUpdate={handleDataUpdate}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4">
          <TenantMaintenance 
            requests={tenant.maintenanceRequests} 
            tenantId={tenant.id}
            onMaintenanceUpdate={handleDataUpdate}
          />
        </TabsContent>

        <TabsContent value="communications" className="mt-4">
          <TenantCommunications communications={tenant.communications} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantProfile;