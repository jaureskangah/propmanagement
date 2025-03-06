
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

      console.log("Communication and all replies deleted successfully");
      
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
    handleDeleteCommunication
  };
};
