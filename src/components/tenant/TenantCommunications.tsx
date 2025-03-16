
import { Card, CardContent } from "@/components/ui/card";
import { Communication } from "@/types/tenant";
import { NewCommunicationDialog } from "./communications/NewCommunicationDialog";
import { CommunicationDetailsDialog } from "./communications/CommunicationDetailsDialog";
import { InviteTenantDialog } from "./communications/InviteTenantDialog";
import { useCommunicationState } from "@/hooks/communications/useCommunicationState";
import { CommunicationsContent } from "./communications/CommunicationsContent";
import { useInviteDialog } from "@/hooks/communications/useInviteDialog";
import { useCreateCommunication } from "@/hooks/communications/useCreateCommunication";
import { useSelectCommunication } from "@/hooks/communications/useSelectCommunication";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CommunicationsPageHeader } from "./communications/header/CommunicationsPageHeader";

interface TenantCommunicationsProps {
  communications: Communication[];
  tenantId: string;
  onCommunicationUpdate?: () => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
  tenant?: { email: string; name?: string } | null;
  isTenant?: boolean;
}

export const TenantCommunications = ({ 
  communications, 
  tenantId,
  onCommunicationUpdate,
  onToggleStatus,
  onDeleteCommunication,
  tenant,
  isTenant = false
}: TenantCommunicationsProps) => {
  const { t } = useLocale();
  const { isInviteDialogOpen, openInviteDialog, closeInviteDialog } = useInviteDialog();
  const {
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    newCommData,
    setNewCommData
  } = useCommunicationState();

  const { handleCreateCommunication } = useCreateCommunication(tenantId, onCommunicationUpdate);
  const { selectedComm, setSelectedComm, handleCommunicationSelect } = useSelectCommunication(onCommunicationUpdate);

  const handleCreateSubmit = async () => {
    const success = await handleCreateCommunication(newCommData);
    if (success) {
      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "message", subject: "", content: "", category: "general" });
    }
  };

  const handleOpenCommunication = async (comm: Communication) => {
    await handleCommunicationSelect(comm);
  };

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CommunicationsPageHeader
        onNewMessageClick={() => setIsNewCommDialogOpen(true)}
        onInviteTenantClick={openInviteDialog}
        isTenant={isTenant}
      />

      <CardContent className="p-6">
        <CommunicationsContent
          communications={communications}
          onToggleStatus={onToggleStatus}
          onCommunicationSelect={handleOpenCommunication}
          onCommunicationUpdate={onCommunicationUpdate}
          onDeleteCommunication={onDeleteCommunication}
          tenantId={tenantId}
        />
      </CardContent>

      <NewCommunicationDialog
        isOpen={isNewCommDialogOpen}
        onClose={() => setIsNewCommDialogOpen(false)}
        newCommData={newCommData}
        onDataChange={setNewCommData}
        onSubmit={handleCreateSubmit}
      />

      {selectedComm && (
        <CommunicationDetailsDialog
          communication={selectedComm}
          isOpen={true}
          onClose={() => setSelectedComm(null)}
          onUpdate={onCommunicationUpdate}
        />
      )}

      {/* N'afficher le dialogue d'invitation que si l'utilisateur n'est pas un locataire */}
      {!isTenant && (
        <InviteTenantDialog
          isOpen={isInviteDialogOpen}
          onClose={closeInviteDialog}
          tenantId={tenantId}
          defaultEmail={tenant?.email}
        />
      )}
    </Card>
  );
};
