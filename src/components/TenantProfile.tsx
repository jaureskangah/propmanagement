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
import { LinkTenantProfile } from "./tenant/profile/LinkTenantProfile";

interface TenantProfileProps {
  tenant: Tenant;
}

const TenantProfile = ({ tenant }: TenantProfileProps) => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { session } = useAuthSession();
  const isTenantUser = session?.user?.id === tenant.tenant_profile_id;

  // Préchargement des données
  React.useEffect(() => {
    console.log("Préchargement des données du tenant:", tenant.id);
    // Précharger les documents
    queryClient.prefetchQuery({
      queryKey: ["tenant_documents", tenant.id],
      queryFn: async () => tenant.documents
    });
    // Précharger les paiements
    queryClient.prefetchQuery({
      queryKey: ["tenant_payments", tenant.id],
      queryFn: async () => tenant.paymentHistory
    });
    // Précharger les demandes de maintenance
    queryClient.prefetchQuery({
      queryKey: ["tenant_maintenance", tenant.id],
      queryFn: async () => tenant.maintenanceRequests
    });
  }, [tenant.id, queryClient]);

  if (!tenant) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No tenant selected</p>
      </Card>
    );
  }

  const handleDataUpdate = () => {
    console.log("Invalidating tenant queries");
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
  };

  // Si l'utilisateur est un tenant non lié, montrer uniquement le bouton de liaison
  if (session?.user && !isTenantUser && session.user.email === tenant.email) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome {tenant.name}</h2>
          <p className="text-muted-foreground mb-4">
            Link your profile to access your tenant portal
          </p>
          <LinkTenantProfile tenant={tenant} onProfileLinked={handleDataUpdate} />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TenantInfoCard tenant={tenant} />

      <Tabs defaultValue={isTenantUser ? "communications" : "documents"} className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : isTenantUser ? 'grid-cols-2' : 'grid-cols-5'} w-full`}>
          {!isTenantUser && (
            <>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="communications">Communications</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </>
              )}
            </>
          )}
          {isTenantUser && (
            <>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </>
          )}
        </TabsList>

        {!isTenantUser && (
          <>
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
          </>
        )}

        {isTenantUser && (
          <>
            <TabsContent value="communications" className="mt-4">
              <TenantCommunications 
                communications={tenant.communications} 
                tenantId={tenant.id}
                onCommunicationUpdate={handleDataUpdate}
                tenant={tenant}
              />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-4">
              <TenantMaintenanceView />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TenantProfile;