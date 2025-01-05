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
      toast({
        title: "Erreur",
        description: "ID du locataire manquant",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Creating new communication:", { ...newCommData, tenantId });

      if (newCommData.type === "email") {
        console.log("Sending email via Edge function");
        const response = await supabase.functions.invoke('send-tenant-email', {
          body: {
            tenantId,
            subject: newCommData.subject,
            content: newCommData.content,
            category: newCommData.category
          }
        });

        console.log("Edge function response:", response);

        if (response.error) {
          console.error("Edge function error:", response.error);
          throw new Error(response.error.message);
        }

        toast({
          title: "Succès",
          description: "Email envoyé avec succès",
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
            category: newCommData.category,
            status: 'unread'
          });

        if (error) {
          console.error("Database error:", error);
          throw error;
        }

        toast({
          title: "Succès",
          description: "Communication créée avec succès",
        });
      }

      return true;
    } catch (error) {
      console.error("Error creating communication:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la communication: " + (error as Error).message,
        variant: "destructive",
      });
      return false;
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

      toast({
        title: "Success",
        description: `Communication marked as ${newStatus === 'read' ? 'read' : 'unread'}`,
      });

      return true;
    } catch (error) {
      console.error("Error updating communication status:", error);
      toast({
        title: "Error",
        description: "Error updating status",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleCreateCommunication,
    handleToggleStatus
  };
};