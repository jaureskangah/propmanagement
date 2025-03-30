
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useTaskCompletion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleTaskCompletion = async (taskId: string, taskCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .update({ 
          completed: !taskCompleted,
          status: !taskCompleted ? 'completed' : 'pending'
        })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: `Task marked as ${!taskCompleted ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Unable to update task status",
        variant: "destructive",
      });
    }
  };

  return { handleTaskCompletion };
};
