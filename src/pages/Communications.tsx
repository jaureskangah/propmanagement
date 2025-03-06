
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
        title: "Bienvenue dans vos communications",
        description: "Vous pouvez envoyer des messages à votre propriétaire directement depuis cette page.",
      });
    }
  }, [isLoading, communications, tenantId]);

  const handleToggleStatusAndRefresh = async (comm: Communication) => {
    if (!comm) return;
    
    console.log("Attempting to toggle status for communication:", comm.id);
    try {
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : !tenantId ? (
          <UnlinkedTenantMessage />
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

export default Communications;
