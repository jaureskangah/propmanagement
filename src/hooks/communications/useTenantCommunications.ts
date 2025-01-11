import { useState } from "react";
import { Communication } from "@/types/tenant";
import { supabase } from "@/lib/supabase";

export const useTenantCommunications = (
  tenantId: string,
  onCommunicationUpdate?: () => void
) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isNewCommDialogOpen, setIsNewCommDialogOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const [newCommData, setNewCommData] = useState({
    type: "email",
    subject: "",
    content: "",
    category: "general"
  });

  const handleCreateSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .insert([
          {
            tenant_id: tenantId,
            type: newCommData.type,
            subject: newCommData.subject,
            content: newCommData.content,
            category: newCommData.category
          }
        ]);

      if (error) throw error;

      setIsNewCommDialogOpen(false);
      setNewCommData({
        type: "email",
        subject: "",
        content: "",
        category: "general"
      });
      onCommunicationUpdate?.();

    } catch (error) {
      console.error('Error creating communication:', error);
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

  const handleToggleStatus = async (comm: Communication) => {
    try {
      const newStatus = comm.status === 'read' ? 'unread' : 'read';
      const { error } = await supabase
        .from('tenant_communications')
        .update({ status: newStatus })
        .eq('id', comm.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error toggling status:', error);
      return false;
    }
  };

  const handleDataChange = (newData: any) => {
    console.log('Updating form data:', newData);
    setNewCommData(newData);
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
    handleToggleStatus,
    handleDataChange
  };
};