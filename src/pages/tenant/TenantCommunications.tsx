
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
import { MessageSquareOff } from "lucide-react";

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

  useRealtimeNotifications();

  const handleToggleStatusAndRefresh = async (comm: Communication) => {
    try {
      console.log("Toggling status for communication:", comm.id);
      const success = await handleToggleStatus(comm);
      if (success) {
        await refreshCommunications();
        toast({
          title: "Succès",
          description: comm.status === 'read' ? "Message marqué comme non lu" : "Message marqué comme lu",
        });
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!communicationToDelete) return;
    
    console.log("Confirming deletion of communication:", communicationToDelete.id);
    
    try {
      const success = await handleDeleteCommunication(communicationToDelete.id);
      if (success) {
        toast({
          title: "Succès",
          description: "Message supprimé avec succès",
        });
        await refreshCommunications();
      }
    } catch (error) {
      console.error("Error deleting communication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    } finally {
      setCommunicationToDelete(null);
    }
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-muted-foreground">Chargement de vos communications...</p>
          </div>
        ) : !tenantId ? (
          <UnlinkedTenantMessage />
        ) : communications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <MessageSquareOff className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium">Aucune communication</h3>
            <p className="text-muted-foreground text-center mt-2 max-w-md">
              Commencez par envoyer un message à votre propriétaire ou gestionnaire immobilier.
            </p>
          </div>
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
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TenantCommunications;
