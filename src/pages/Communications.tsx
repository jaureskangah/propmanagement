
import AppSidebar from "@/components/AppSidebar";
import { useTenantCommunications } from "@/hooks/tenant/useTenantCommunications";
import { TenantCommunications as TenantCommunicationsComponent } from "@/components/tenant/TenantCommunications";
import { UnlinkedTenantMessage } from "@/components/tenant/communications/UnlinkedTenantMessage";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Communication } from "@/types/tenant";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { MessageSquareOff } from "lucide-react";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

const Communications = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const {
    tenantId,
    communications,
    handleCreateCommunication,
    refreshCommunications,
    isLoading,
    tenant
  } = useTenantCommunications();

  const { handleToggleStatus, handleDeleteCommunication } = useCommunicationActions(tenantId || undefined);
  const [communicationToDelete, setCommunicationToDelete] = useState<Communication | null>(null);

  useEffect(() => {
    if (!isLoading && communications.length === 0 && tenantId) {
      toast({
        title: t('welcomeToCommunications'),
        description: t('sendMessageDescription'),
      });
    }
  }, [isLoading, communications, tenantId]);

  const handleToggleStatusAndRefresh = async (comm: Communication) => {
    if (!comm) return;
    console.log("Attempting to toggle status for communication:", comm.id);
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
          description: t('errorDeletingMessage'),
          variant: "destructive",
        });
        setCommunicationToDelete(null);
      });
  };

  return (
    <>
      <AppSidebar isTenant={true} />
      <ResponsiveLayout title={t('communications')} className="p-3 sm:p-4 md:p-6">
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <p className="ml-4 text-muted-foreground">{t('loadingCommunications')}</p>
            </div>
          ) : !tenantId ? (
            <UnlinkedTenantMessage />
          ) : communications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center p-12 h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <MessageSquareOff className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium">{t('noCommunications')}</h3>
              <p className="text-muted-foreground text-center mt-2 max-w-md">
                {t('startSendingMessages')}
              </p>
            </motion.div>
          ) : (
            <TenantCommunicationsComponent
              communications={communications}
              tenantId={tenantId}
              onCommunicationUpdate={refreshCommunications}
              tenant={tenant}
              onToggleStatus={handleToggleStatusAndRefresh}
              onDeleteCommunication={setCommunicationToDelete}
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
      </ResponsiveLayout>
    </>
  );
};

export default Communications;
