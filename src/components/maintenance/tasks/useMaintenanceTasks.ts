import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Task, NewTask } from "../types";
import { useAuth } from "@/components/AuthProvider";

export const useMaintenanceTasks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['maintenance_tasks'],
    queryFn: async () => {
      console.log("Fetching maintenance tasks...");
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      return data.map(task => ({
        ...task,
        date: new Date(task.date),
        type: task.type as "regular" | "inspection" | "seasonal"
      }));
    },
  });

  const handleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: `Task marked as ${!task.completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async (newTask: NewTask) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add tasks",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .insert({
          title: newTask.title,
          date: format(newTask.date, 'yyyy-MM-dd'),
          type: newTask.type,
          completed: false,
          user_id: user.id
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  return {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleDeleteTask,
    handleAddTask,
  };
};