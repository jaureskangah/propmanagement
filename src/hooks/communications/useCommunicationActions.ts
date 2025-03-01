
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Communication } from "@/types/tenant";

export const useCommunicationActions = (tenantId?: string) => {
  const { toast } = useToast();

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
        console.log("Attempting to send email via Edge function");
        const response = await supabase.functions.invoke('send-tenant-email', {
          body: {
            tenantId,
            subject: newCommData.subject,
            content: newCommData.content,
            category
          }
        });

        console.log("Edge function response:", response);

        if (response.error) {
          console.error("Edge function error:", response.error);
          throw new Error(response.error.message || "Error sending email");
        }

        // Create communication record after successful email send
        const { error: dbError } = await supabase
          .from('tenant_communications')
          .insert({
            tenant_id: tenantId,
            type: 'email',
            subject: newCommData.subject,
            content: newCommData.content,
            category,
            status: 'sent'
          });

        if (dbError) {
          console.error("Database error after email send:", dbError);
          throw dbError;
        }

        // Add notification for email sent
        toast({
          title: "Email Sent",
          description: `Email "${newCommData.subject}" has been sent to the tenant`,
          variant: "default",
        });
      } else {
        console.log("Creating non-email communication");
        const { error } = await supabase
          .from('tenant_communications')
          .insert({
            tenant_id: tenantId,
            type: newCommData.type,
            subject: newCommData.subject,
            content: newCommData.content,
            category,
            status: 'unread'
          });

        if (error) {
          console.error("Database error:", error);
          throw error;
        }

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

  const handleToggleStatus = async (comm: Communication) => {
    try {
      console.log("Toggling status for communication:", comm.id);
      const newStatus = comm.status === 'read' ? 'unread' : 'read';
      
      const { error } = await supabase
        .from('tenant_communications')
        .update({ status: newStatus })
        .eq('id', comm.id);

      if (error) {
        console.error("Error in handleToggleStatus:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Communication marked as ${newStatus === 'read' ? 'read' : 'unread'}`,
      });

      return true;
    } catch (error) {
      console.error("Error in handleToggleStatus:", error);
      toast({
        title: "Error",
        description: "Error updating status",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteCommunication = async (commId: string) => {
    try {
      console.log("Starting deletion process for communication:", commId);
      
      // First, fetch all replies to this communication
      const { data: replies, error: fetchError } = await supabase
        .from('tenant_communications')
        .select('id')
        .eq('parent_id', commId);

      if (fetchError) {
        console.error("Error fetching replies:", fetchError);
        throw fetchError;
      }

      console.log("Found replies:", replies);

      // If there are replies, delete them one by one
      if (replies && replies.length > 0) {
        for (const reply of replies) {
          console.log("Deleting reply:", reply.id);
          const { error: replyError } = await supabase
            .from('tenant_communications')
            .delete()
            .eq('id', reply.id);

          if (replyError) {
            console.error("Error deleting reply:", replyError);
            throw replyError;
          }
        }
      }

      // Now that all replies are deleted, delete the original communication
      console.log("Deleting original communication:", commId);
      const { error } = await supabase
        .from('tenant_communications')
        .delete()
        .eq('id', commId);

      if (error) {
        console.error("Error deleting communication:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Communication and all replies deleted successfully",
      });

      return true;
    } catch (error) {
      console.error("Error in handleDeleteCommunication:", error);
      toast({
        title: "Error",
        description: "Error deleting communication",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleCreateCommunication,
    handleToggleStatus,
    handleDeleteCommunication
  };
};
