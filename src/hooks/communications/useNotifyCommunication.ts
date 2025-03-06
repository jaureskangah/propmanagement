
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useNotifyCommunication = () => {
  const { toast } = useToast();

  const sendNotification = async (
    tenantId: string,
    subject: string,
    content: string,
    isFromTenant: boolean
  ) => {
    try {
      console.log("Sending notification for communication:", { tenantId, subject, isFromTenant });
      
      const { error } = await supabase.functions.invoke('notify-communication', {
        body: {
          tenantId,
          subject,
          content,
          isFromTenant
        }
      });

      if (error) {
        console.error("Error sending notification:", error);
        toast({
          title: "Warning",
          description: "Message sent but notification delivery failed",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("Notification sent successfully");
      return true;
    } catch (error) {
      console.error("Error in sendNotification:", error);
      return false;
    }
  };

  return { sendNotification };
};
