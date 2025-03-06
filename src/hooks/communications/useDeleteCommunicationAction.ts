
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useDeleteCommunicationAction = () => {
  const { toast } = useToast();

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

      // If there are replies, delete them first
      if (replies && replies.length > 0) {
        const { error: repliesError } = await supabase
          .from('tenant_communications')
          .delete()
          .in('id', replies.map(reply => reply.id));

        if (repliesError) {
          console.error("Error deleting replies:", repliesError);
          throw repliesError;
        }
      }

      // Now delete the main communication
      const { error: deleteError } = await supabase
        .from('tenant_communications')
        .delete()
        .eq('id', commId);

      if (deleteError) {
        console.error("Error deleting main communication:", deleteError);
        throw deleteError;
      }

      toast({
        title: "Succès",
        description: "Message supprimé avec succès",
      });

      return true;
    } catch (error) {
      console.error("Error in handleDeleteCommunication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleDeleteCommunication
  };
};
