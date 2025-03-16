
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Tenant } from "@/types/tenant";
import { useSearchParams } from "react-router-dom";

interface TenantTabsProps {
  tenant: Tenant;
  isTenantUser: boolean;
  handleDataUpdate: () => void;
}

export const TenantTabs = ({ tenant, isTenantUser, handleDataUpdate }: TenantTabsProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useLocale();
  const { handleToggleStatus, handleDeleteCommunication } = useCommunicationActions(tenant.id);
  const [communicationToDelete, setCommunicationToDelete] = useState<Communication | null>(null);
  const [searchParams] = useSearchParams();
  const defaultTabFromUrl = searchParams.get("tab");

  // Determine default tab based on URL parameter or user type
  const getDefaultTab = () => {
    if (defaultTabFromUrl) {
      // Check if the default tab from URL is valid for the current user type
      if (isTenantUser && (defaultTabFromUrl === "communications" || defaultTabFromUrl === "maintenance")) {
        return defaultTabFromUrl;
      } else if (!isTenantUser) {
        return defaultTabFromUrl;
      }
    }
    return isTenantUser ? "communications" : "documents";
  };

  const handleToggleStatusAndRefresh = async (comm: Communication) => {
    const success = await handleToggleStatus(comm);
    if (success) {
      handleDataUpdate();
    }
  };

  const handleDeleteConfirm = () => {
    if (!communicationToDelete) return;
    
    handleDeleteCommunication(communicationToDelete.id)
      .then(success => {
        if (success) {
          toast({
            title: t('success'),
            description: t('messageDeleted'),
          });
          handleDataUpdate();
          setCommunicationToDelete(null);
        }
      });
  };

  return (
    <>
      <Tabs defaultValue={getDefaultTab()} className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : isTenantUser ? 'grid-cols-2' : 'grid-cols-5'} w-full mb-6`}>
          {!isTenantUser && (
            <>
              <TabsTrigger value="documents" className="text-sm md:text-base">Documents</TabsTrigger>
              <TabsTrigger value="payments" className="text-sm md:text-base">Payments</TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger value="maintenance" className="text-sm md:text-base">Maintenance</TabsTrigger>
                  <TabsTrigger value="communications" className="text-sm md:text-base">Communications</TabsTrigger>
                  <TabsTrigger value="reports" className="text-sm md:text-base">Reports</TabsTrigger>
                </>
              )}
            </>
          )}
          {isTenantUser && (
            <>
              <TabsTrigger value="communications" className="text-sm md:text-base">Communications</TabsTrigger>
              <TabsTrigger value="maintenance" className="text-sm md:text-base">Maintenance</TabsTrigger>
            </>
          )}
        </TabsList>

        {!isTenantUser && (
          <>
            <TabsContent value="documents" className="mt-0">
              <TenantDocuments 
                documents={tenant.documents} 
                tenantId={tenant.id}
                onDocumentUpdate={handleDataUpdate}
                tenant={tenant}
              />
            </TabsContent>

            <TabsContent value="payments" className="mt-0">
              <TenantPayments 
                payments={tenant.paymentHistory} 
                tenantId={tenant.id}
                onPaymentUpdate={handleDataUpdate}
              />
            </TabsContent>

            {!isMobile && (
              <>
                <TabsContent value="maintenance" className="mt-0">
                  <TenantMaintenance 
                    requests={tenant.maintenanceRequests} 
                    tenantId={tenant.id}
                    onMaintenanceUpdate={handleDataUpdate}
                  />
                </TabsContent>

                <TabsContent value="communications" className="mt-0">
                  <TenantCommunications 
                    communications={tenant.communications} 
                    tenantId={tenant.id}
                    onCommunicationUpdate={handleDataUpdate}
                    tenant={tenant}
                    onToggleStatus={handleToggleStatusAndRefresh}
                    onDeleteCommunication={setCommunicationToDelete}
                  />
                </TabsContent>

                <TabsContent value="reports" className="mt-0">
                  <TenantFinancialReport tenantId={tenant.id} />
                </TabsContent>
              </>
            )}
          </>
        )}

        {isTenantUser && (
          <>
            <TabsContent value="communications" className="mt-0">
              <TenantCommunications 
                communications={tenant.communications} 
                tenantId={tenant.id}
                onCommunicationUpdate={handleDataUpdate}
                tenant={tenant}
                onToggleStatus={handleToggleStatusAndRefresh}
                onDeleteCommunication={setCommunicationToDelete}
              />
            </TabsContent>

            <TabsContent value="maintenance" className="mt-0">
              <TenantMaintenanceView />
            </TabsContent>
          </>
        )}
      </Tabs>

      <AlertDialog open={!!communicationToDelete} onOpenChange={() => setCommunicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDeleteMessage') || t('confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('deleteMessage')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
