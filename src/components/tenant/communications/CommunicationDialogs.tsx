import { Communication } from "@/types/tenant";
import { NewCommunicationDialog } from "./NewCommunicationDialog";
import { CommunicationDetailsDialog } from "./CommunicationDetailsDialog";
import { InviteTenantDialog } from "./InviteTenantDialog";

interface CommunicationDialogsProps {
  isNewCommDialogOpen: boolean;
  onNewCommClose: () => void;
  newCommData: any;
  onDataChange: (data: any) => void;
  onSubmit: () => void;
  selectedComm: Communication | null;
  onDetailsClose: () => void;
  isInviteDialogOpen: boolean;
  onInviteClose: () => void;
  tenantId: string;
  defaultEmail?: string;
}

export const CommunicationDialogs = ({
  isNewCommDialogOpen,
  onNewCommClose,
  newCommData,
  onDataChange,
  onSubmit,
  selectedComm,
  onDetailsClose,
  isInviteDialogOpen,
  onInviteClose,
  tenantId,
  defaultEmail
}: CommunicationDialogsProps) => {
  return (
    <>
      <NewCommunicationDialog
        isOpen={isNewCommDialogOpen}
        onClose={onNewCommClose}
        newCommData={newCommData}
        onDataChange={onDataChange}
        onSubmit={onSubmit}
      />

      <CommunicationDetailsDialog
        communication={selectedComm}
        onClose={onDetailsClose}
      />

      <InviteTenantDialog
        isOpen={isInviteDialogOpen}
        onClose={onInviteClose}
        tenantId={tenantId}
        defaultEmail={defaultEmail}
      />
    </>
  );
};