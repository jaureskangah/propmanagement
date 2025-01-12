import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantInfoCard } from "./tenant/profile/TenantInfoCard";
import { TenantDocuments } from "./tenant/TenantDocuments";
import { TenantPayments } from "./tenant/TenantPayments";
import { TenantMaintenance } from "./tenant/TenantMaintenance";
import { TenantCommunications } from "./tenant/TenantCommunications";
import { TenantFinancialReport } from "./tenant/reports/TenantFinancialReport";
import { TenantMaintenanceView } from "./tenant/maintenance/TenantMaintenanceView";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Tenant } from "@/types/tenant";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthSession } from "@/hooks/useAuthSession";

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { session } = useAuthSession();
  const isTenantUser = session?.user?.id === tenant.tenant_profile_id;

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
          {!isMobile && !isTenantUser && (
            <>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </>
          )}
          {isTenantUser && (
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
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

        {!isMobile && !isTenantUser && (
          <>
            <TabsContent value="maintenance" className="mt-4">
              <TenantMaintenance 
                requests={tenant.maintenanceRequests} 
                tenantId={tenant.id}
                onMaintenanceUpdate={handleDataUpdate}
              />
            </TabsContent>

            <TabsContent value="communications" className="mt-4">
              <TenantCommunications 
                communications={tenant.communications} 
                tenantId={tenant.id}
                onCommunicationUpdate={handleDataUpdate}
                tenant={tenant}
              />
            </TabsContent>

            <TabsContent value="reports" className="mt-4">
              <TenantFinancialReport tenantId={tenant.id} />
            </TabsContent>
          </>
        )}

        {isTenantUser && (
          <TabsContent value="maintenance" className="mt-4">
            <TenantMaintenanceView />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TenantProfile;