
import AppSidebar from "@/components/AppSidebar";
import { useTenantCommunications } from "@/hooks/tenant/useTenantCommunications";
import { TenantCommunicationsContent } from "@/components/tenant/communications/TenantCommunicationsContent";
import { UnlinkedTenantMessage } from "@/components/tenant/communications/UnlinkedTenantMessage";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { useState } from "react";
import { Communication } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocale } from "@/components/providers/LocaleProvider";

const TenantCommunications = () => {
  const {
    tenantId,
    communications,
    handleCreateCommunication,
    refreshCommunications,
    isLoading,
    tenant
  } = useTenantCommunications();

  const { t } = useLocale();
  const { toast } = useToast();
  const { handleToggleStatus, handleDeleteCommunication } = useCommunicationActions(tenantId || undefined);
  const [communicationToDelete, setCommunicationToDelete] = useState<Communication | null>(null);

  // Activer les notifications en temps réel
  useRealtimeNotifications();

  const handleToggleStatusAndRefresh = async (comm: Communication) => {
    const success = await handleToggleStatus(comm);
    if (success) {
      refreshCommunications();
    }
  };

  const handleDeleteConfirm = () => {
    if (!communicationToDelete) return;
    
    console.log("Confirming deletion of communication:", communicationToDelete.id);
    
    handleDeleteCommunication(communicationToDelete.id)
      .then(success => {
        if (success) {
          toast({
            title: t('success'),
            description: t('messageDeleted'),
          });
          refreshCommunications();
        }
        setCommunicationToDelete(null);
      })
      .catch(error => {
        console.error("Error deleting communication:", error);
        toast({
          title: t('error'),
          description: "Erreur lors de la suppression du message",
          variant: "destructive",
        });
        setCommunicationToDelete(null);
      });
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : !tenantId ? (
          <UnlinkedTenantMessage />
        ) : (
          <TenantCommunicationsContent
            communications={communications}
            onCreateCommunication={handleCreateCommunication}
            onCommunicationUpdate={refreshCommunications}
            onToggleStatus={handleToggleStatusAndRefresh}
            onDeleteCommunication={setCommunicationToDelete}
            tenant={tenant}
          />
        )}
      </div>

      <AlertDialog open={!!communicationToDelete} onOpenChange={() => setCommunicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDeleteMessage')}
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
    </div>
  );
};

export default TenantCommunications;
