
import { Card, CardHeader } from "@/components/ui/card";
import { Communication } from "@/types/tenant";
import { NewCommunicationDialog } from "./communications/NewCommunicationDialog";
import { CommunicationDetailsDialog } from "./communications/CommunicationDetailsDialog";
import { CommunicationsHeader } from "./communications/header/CommunicationsHeader";
import { InviteTenantDialog } from "./communications/InviteTenantDialog";
import { useCommunicationState } from "@/hooks/communications/useCommunicationState";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { CommunicationsContent } from "./communications/CommunicationsContent";
import { useInviteDialog } from "@/hooks/communications/useInviteDialog";
import { useCreateCommunication } from "@/hooks/communications/useCreateCommunication";
import { useSelectCommunication } from "@/hooks/communications/useSelectCommunication";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantCommunicationsProps {
  communications: Communication[];
  tenantId: string;
  onCommunicationUpdate?: () => void;
  tenant?: { email: string };
}

export const TenantCommunications = ({ 
  communications, 
  tenantId,
  onCommunicationUpdate,
  tenant 
}: TenantCommunicationsProps) => {
  const { t } = useLocale();
  const { isInviteDialogOpen, openInviteDialog, closeInviteDialog } = useInviteDialog();
  const {
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    newCommData,
    setNewCommData
  } = useCommunicationState();

  const { handleToggleStatus } = useCommunicationActions(tenantId);
  const { handleCreateCommunication } = useCreateCommunication(tenantId, onCommunicationUpdate);
  const { selectedComm, setSelectedComm, handleCommunicationSelect } = useSelectCommunication(onCommunicationUpdate);

  const handleCreateSubmit = async () => {
    const success = await handleCreateCommunication(newCommData);
    if (success) {
      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "message", subject: "", content: "", category: "general" });
    }
  };

  const handleToggleStatusAndUpdate = async (comm: Communication) => {
    const success = await handleToggleStatus(comm);
    if (success) {
      onCommunicationUpdate?.();
    }
  };

  const handleOpenCommunication = async (comm: Communication) => {
    await handleCommunicationSelect(comm);
  };

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CommunicationsHeader 
          onNewClick={() => setIsNewCommDialogOpen(true)}
          onInviteTenantClick={openInviteDialog}
        />
      </CardHeader>

      <CommunicationsContent
        communications={communications}
        onToggleStatus={handleToggleStatusAndUpdate}
        onCommunicationSelect={handleOpenCommunication}
        onCommunicationUpdate={onCommunicationUpdate}
      />

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

      <InviteTenantDialog
        isOpen={isInviteDialogOpen}
        onClose={closeInviteDialog}
        tenantId={tenantId}
        defaultEmail={tenant?.email}
      />
    </Card>
  );
};
