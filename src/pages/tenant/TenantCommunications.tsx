
import AppSidebar from "@/components/AppSidebar";
import { useTenantCommunications } from "@/hooks/tenant/useTenantCommunications";
import { TenantCommunicationsContent } from "@/components/tenant/communications/TenantCommunicationsContent";
import { UnlinkedTenantMessage } from "@/components/tenant/communications/UnlinkedTenantMessage";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { useState } from "react";
import { Communication } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MessageSquareOff } from "lucide-react";
import { motion } from "framer-motion";

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

  // Activer les notifications en temps réel
  useRealtimeNotifications();

  const handleToggleStatusAndRefresh = async (comm: Communication) => {
    const success = await handleToggleStatus(comm);
    if (success) {
      refreshCommunications();
    }
  };

  const handleDeleteAndRefresh = async (comm: Communication) => {
    console.log("Deleting communication:", comm.id);
    
    const success = await handleDeleteCommunication(comm.id);
    if (success) {
      toast({
        title: t('success'),
        description: t('messageDeleted'),
      });
      refreshCommunications();
    } else {
      toast({
        title: t('error'),
        description: t('errorDeletingMessage'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-3 sm:p-4 md:p-6 space-y-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-muted-foreground">{t('loadingCommunications')}</p>
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
          <TenantCommunicationsContent
            communications={communications}
            onCreateCommunication={handleCreateCommunication}
            onCommunicationUpdate={refreshCommunications}
            onToggleStatus={handleToggleStatusAndRefresh}
            onDeleteCommunication={handleDeleteAndRefresh}
            tenant={tenant}
          />
        )}
      </div>
    </div>
  );
};

export default TenantCommunications;
