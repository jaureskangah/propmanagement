
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Communication } from "@/types/tenant";

export const useStatusToggleAction = () => {
  const { toast } = useToast();

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

  return {
    handleToggleStatus
  };
};
