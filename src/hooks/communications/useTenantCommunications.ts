import { useState } from "react";
import { Communication } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import { useCommunicationState } from "./useCommunicationState";
import { useCommunicationActions } from "./useCommunicationActions";

export const useTenantCommunications = (
  tenantId: string,
  onCommunicationUpdate?: () => void
) => {
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
    const success = await handleCreateCommunication({
      ...newCommData,
      is_from_tenant: true
    });
    if (success) {
      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "email", subject: "", content: "", category: "general" });
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

  const handleReply = (comm: Communication) => {
    setNewCommData({
      type: "email",
      subject: `Re: ${comm.subject}`,
      content: "",
      category: "general"
    });
    setIsNewCommDialogOpen(true);
  };

  const handleDataChange = (data: typeof newCommData) => {
    console.log("Updating form data:", data);
    setNewCommData(data);
  };

  return {
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    selectedComm,
    setSelectedComm,
    newCommData,
    handleCreateSubmit,
    handleCommunicationSelect,
    handleToggleStatusAndUpdate,
    handleReply,
    handleDataChange
  };
};