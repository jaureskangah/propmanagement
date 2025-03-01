
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { TenantDocuments } from "../TenantDocuments";
import { TenantPayments } from "../TenantPayments";
import { TenantMaintenance } from "../TenantMaintenance";
import { TenantCommunications } from "../TenantCommunications";
import { TenantFinancialReport } from "../reports/TenantFinancialReport";
import { TenantMaintenanceView } from "../maintenance/TenantMaintenanceView";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Communication } from "@/types/tenant";
import type { Tenant } from "@/types/tenant";

interface TenantTabsProps {
  tenant: Tenant;
  isTenantUser: boolean;
  handleDataUpdate: () => void;
}

export const TenantTabs = ({ tenant, isTenantUser, handleDataUpdate }: TenantTabsProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { handleToggleStatus, handleDeleteCommunication } = useCommunicationActions(tenant.id);
  const [communicationToDelete, setCommunicationToDelete] = useState<Communication | null>(null);

  const handleToggleStatusAndRefresh = async (comm: Communication) => {
    const success = await handleToggleStatus(comm);
    if (success) {
      handleDataUpdate();
    }
  };

  const handleDeleteConfirm = async (comm: Communication) => {
    const success = await handleDeleteCommunication(comm.id);
    if (success) {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
      handleDataUpdate();
    }
  };

  return (
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
                  onToggleStatus={handleToggleStatusAndRefresh}
                  onDeleteCommunication={handleDeleteConfirm}
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
              onToggleStatus={handleToggleStatusAndRefresh}
              onDeleteCommunication={handleDeleteConfirm}
            />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4">
            <TenantMaintenanceView />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};
