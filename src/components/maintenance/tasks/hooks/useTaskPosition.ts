
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useTaskPosition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUpdateTaskPosition = async (taskId: string, newPosition: number) => {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .update({ position: newPosition })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    } catch (error) {
      console.error("Error updating task position:", error);
      toast({
        title: "Error",
        description: "Unable to update task position",
        variant: "destructive",
      });
    }
  };

  return { handleUpdateTaskPosition };
};
