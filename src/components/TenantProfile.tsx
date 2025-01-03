import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantInfoCard } from "./tenant/profile/TenantInfoCard";
import { TenantDocuments } from "./tenant/TenantDocuments";
import { TenantPayments } from "./tenant/TenantPayments";
import { TenantMaintenance } from "./tenant/TenantMaintenance";
import { TenantCommunications } from "./tenant/TenantCommunications";
import { TenantFinancialReport } from "./tenant/reports/TenantFinancialReport";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Tenant } from "@/types/tenant";
import { useQueryClient } from "@tanstack/react-query";

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

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
      <TenantInfoCard tenant={tenant} />

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} w-full`}>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="documents" className="mt-4">
          <TenantDocuments 
            documents={tenant.documents} 
            tenantId={tenant.id}
            onDocumentUpdate={handleDataUpdate}
            tenant={tenant}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <TenantPayments 
            payments={tenant.paymentHistory} 
            tenantId={tenant.id}
            onPaymentUpdate={handleDataUpdate}
          />
        </TabsContent>

        {!isMobile && (
          <>
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

            <TabsContent value="reports" className="mt-4">
              <TenantFinancialReport tenantId={tenant.id} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TenantProfile;