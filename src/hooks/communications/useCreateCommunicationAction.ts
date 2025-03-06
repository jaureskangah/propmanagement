
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { sendTenantEmail, createCommunicationRecord } from "./utils/emailOperations";
import { useNotifyCommunication } from "./useNotifyCommunication";

export const useCreateCommunicationAction = (tenantId?: string) => {
  const { toast } = useToast();
  const { sendNotification } = useNotifyCommunication();

  const handleCreateCommunication = async (newCommData: {
    type: string;
    subject: string;
    content: string;
    category: string;
  }) => {
    if (!tenantId) {
      console.error("Missing tenantId in handleCreateCommunication");
      toast({
        title: "Error",
        description: "Tenant ID missing",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("Starting communication creation with data:", { ...newCommData, tenantId });

      // Always use 'general' category for email sending
      const category = 'general';
      console.log("Using category:", category);

      if (newCommData.type === "email") {
        await sendTenantEmail(tenantId, newCommData.subject, newCommData.content, category);

        // Create communication record after successful email send
        await createCommunicationRecord(
          tenantId,
          'email',
          newCommData.subject,
          newCommData.content,
          category,
          'sent'
        );

        // Add notification for email sent
        toast({
          title: "Email Sent",
          description: `Email "${newCommData.subject}" has been sent to the tenant`,
          variant: "default",
        });
      } else {
        console.log("Creating non-email communication");
        await createCommunicationRecord(
          tenantId,
          newCommData.type,
          newCommData.subject,
          newCommData.content,
          category,
          'unread'
        );

        // Send notification if it's not an email
        await sendNotification(
          tenantId,
          newCommData.subject,
          newCommData.content,
          false
        );

        toast({
          title: "Success",
          description: "Communication created successfully",
        });
      }

      return true;
    } catch (error) {
      console.error("Error in handleCreateCommunication:", error);
      toast({
        title: "Error",
        description: "Error creating communication: " + (error as Error).message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleCreateCommunication
  };
};
