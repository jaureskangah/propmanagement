import { Card, CardHeader } from "@/components/ui/card";
import { Communication } from "@/types/tenant";
import { NewCommunicationDialog } from "./communications/NewCommunicationDialog";
import { CommunicationDetailsDialog } from "./communications/CommunicationDetailsDialog";
import { CommunicationsHeader } from "./communications/header/CommunicationsHeader";
import { InviteTenantDialog } from "./communications/InviteTenantDialog";
import { useCommunicationState } from "@/hooks/communications/useCommunicationState";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { useState } from "react";
import { CommunicationsContent } from "./communications/CommunicationsContent";
import { supabase } from "@/lib/supabase";

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
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const {
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    selectedComm,
    setSelectedComm,
    newCommData,
    setNewCommData
  } = useCommunicationState();

  const { handleCreateCommunication, handleToggleStatus } = useCommunicationActions(tenantId);

  const handleCreateSubmit = async () => {
    console.log("Attempting to create communication with tenantId:", tenantId);
    const success = await handleCreateCommunication(newCommData);
    if (success) {
      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "", subject: "", content: "", category: "general" });
      onCommunicationUpdate?.();
    }
  };

  const handleCommunicationSelect = async (comm: Communication) => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('id', comm.id)
        .single();

      if (error) {
        console.error('Error fetching communication details:', error);
        return;
      }

      console.log('Fetched communication details:', data);
      setSelectedComm(data);
    } catch (error) {
      console.error('Error in handleCommunicationSelect:', error);
    }
  };

  const handleToggleStatusAndUpdate = async (comm: Communication) => {
    const success = await handleToggleStatus(comm);
    if (success) {
      onCommunicationUpdate?.();
    }
  };

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
        onToggleStatus={handleToggleStatusAndUpdate}
        onCommunicationSelect={handleCommunicationSelect}
        onCommunicationUpdate={onCommunicationUpdate}
      />

      <NewCommunicationDialog
        isOpen={isNewCommDialogOpen}
        onClose={() => setIsNewCommDialogOpen(false)}
        newCommData={newCommData}
        onDataChange={setNewCommData}
        onSubmit={handleCreateSubmit}
      />

      <CommunicationDetailsDialog
        communication={selectedComm}
        onClose={() => setSelectedComm(null)}
      />

      <InviteTenantDialog
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        tenantId={tenantId}
        defaultEmail={tenant?.email}
      />
    </Card>
  );
};