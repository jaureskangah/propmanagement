import { Card, CardHeader } from "@/components/ui/card";
import { Communication } from "@/types/tenant";
import { CommunicationsHeader } from "./communications/header/CommunicationsHeader";
import { CommunicationsContent } from "./communications/CommunicationsContent";
import { CommunicationDialogs } from "./communications/CommunicationDialogs";
import { useTenantCommunications } from "@/hooks/communications/useTenantCommunications";

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
  const {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    selectedComm,
    setSelectedComm,
    newCommData,
    handleCreateSubmit,
    handleCommunicationSelect,
    handleToggleStatus,
    handleDataChange
  } = useTenantCommunications(tenantId, onCommunicationUpdate);

  console.log("Tenant email for invitation:", tenant?.email);

  return (
    <Card>
      <CardHeader>
        <CommunicationsHeader 
          onNewClick={() => setIsNewCommDialogOpen(true)}
          onInviteTenantClick={() => setIsInviteDialogOpen(true)}
        />
      </CardHeader>

      <CommunicationsContent
        communications={communications}
        onToggleStatus={handleToggleStatus}
        onCommunicationSelect={handleCommunicationSelect}
        onCommunicationUpdate={onCommunicationUpdate}
      />

      <CommunicationDialogs
        isNewCommDialogOpen={isNewCommDialogOpen}
        onNewCommClose={() => setIsNewCommDialogOpen(false)}
        newCommData={newCommData}
        onDataChange={handleDataChange}
        onSubmit={handleCreateSubmit}
        selectedComm={selectedComm}
        onDetailsClose={() => setSelectedComm(null)}
        isInviteDialogOpen={isInviteDialogOpen}
        onInviteClose={() => setIsInviteDialogOpen(false)}
        tenantId={tenantId}
        defaultEmail={tenant?.email}
      />
    </Card>
  );
};