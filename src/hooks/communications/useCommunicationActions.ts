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
        title: "Erreur",
        description: "ID du locataire manquant",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log("Starting communication creation with data:", { ...newCommData, tenantId });

      // Ensure category is a valid string and lowercase
      const category = newCommData.category?.toLowerCase() || 'general';
      console.log("Normalized category:", category);

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
          throw new Error(response.error.message || "Erreur lors de l'envoi de l'email");
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
            category,
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
      console.error("Error in handleCreateCommunication:", error);
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
        title: "Succès",
        description: `Communication marquée comme ${newStatus === 'read' ? 'lue' : 'non lue'}`,
      });

      return true;
    } catch (error) {
      console.error("Error in handleToggleStatus:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
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