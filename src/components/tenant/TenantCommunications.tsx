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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
    
    try {
      if (newCommData.type === "message") {
        // Pour les messages directs (non-email)
        const { data, error } = await supabase
          .from('tenant_communications')
          .insert({
            tenant_id: tenantId,
            type: newCommData.type,
            subject: newCommData.subject,
            content: newCommData.content,
            category: newCommData.category,
            status: 'unread',
            is_from_tenant: true
          })
          .select()
          .single();

        if (error) throw error;
        
        console.log("Message created successfully:", data);
        toast({
          title: "Success",
          description: "Message sent successfully",
        });
      } else {
        // Pour les emails, utiliser la fonction existante
        const success = await handleCreateCommunication(newCommData);
        if (!success) throw new Error("Failed to send email");
      }

      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "message", subject: "", content: "", category: "general" });
      onCommunicationUpdate?.();
    } catch (error) {
      console.error("Error creating communication:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCommunicationSelect = async (comm: Communication) => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('id', comm.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching communication details:', error);
        toast({
          title: "Error",
          description: "Failed to load communication details. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.log('No communication found with ID:', comm.id);
        toast({
          title: "Not Found",
          description: "The selected communication could not be found.",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched communication details:', data);
      setSelectedComm(data);
    } catch (error) {
      console.error('Error in handleCommunicationSelect:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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