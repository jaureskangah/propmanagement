import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useCreateCommunication = (tenantId: string, onCommunicationUpdate?: () => void) => {
  const { toast } = useToast();

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

      const { error: notificationError } = await supabase.functions.invoke('notify-communication', {
        body: {
          tenantId,
          subject: newCommData.subject,
          content: formattedContent,
          isFromTenant: true
        }
      });

      if (notificationError) {
        console.error("Error sending notification:", notificationError);
      }

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