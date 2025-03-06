
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNotifyCommunication } from "./useNotifyCommunication";

export const useCreateCommunication = (tenantId: string, onCommunicationUpdate?: () => void) => {
  const { toast } = useToast();
  const { sendNotification } = useNotifyCommunication();

  const handleCreateCommunication = async (newCommData: {
    subject: string;
    content: string;
    category: string;
  }) => {
    console.log("Attempting to create communication with tenantId:", tenantId);
    
    try {
      const formattedContent = `Hello,\n\n${newCommData.content}\n\nKind regards`;
      
      const { data, error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: tenantId,
          type: 'message',
          subject: newCommData.subject,
          content: formattedContent,
          category: newCommData.category,
          status: 'unread',
          is_from_tenant: true
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log("Message created successfully:", data);

      // Use the separated notification hook
      await sendNotification(
        tenantId,
        newCommData.subject,
        formattedContent,
        true
      );

      toast({
        title: "Success",
        description: "Message sent successfully",
      });

      onCommunicationUpdate?.();
      return true;
    } catch (error) {
      console.error("Error creating communication:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleCreateCommunication };
};
