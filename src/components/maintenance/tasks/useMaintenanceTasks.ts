
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
        .order('position', { ascending: true });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      
      return data.map(task => ({
        ...task,
        date: new Date(task.date),
        type: task.type as "regular" | "inspection" | "seasonal",
        priority: (task.priority || "medium") as "low" | "medium" | "high" | "urgent",
        status: (task.status || "pending") as "pending" | "in_progress" | "completed",
        completed: Boolean(task.completed),
        is_recurring: Boolean(task.is_recurring),
        recurrence_pattern: task.recurrence_pattern ? {
          frequency: (task.recurrence_pattern as any).frequency || "daily",
          interval: (task.recurrence_pattern as any).interval || 1,
          endDate: (task.recurrence_pattern as any).endDate
        } : undefined
      })) as Task[];
    },
  });

  const handleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .update({ 
          completed: !task.completed,
          status: !task.completed ? 'completed' : 'pending'
        })
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
        description: "Unable to update task status",
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
        description: "Unable to delete task",
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
      const { data: lastTask } = await supabase
        .from('maintenance_tasks')
        .select('position')
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = (lastTask?.[0]?.position ?? -1) + 1;

      const { error } = await supabase
        .from('maintenance_tasks')
        .insert({
          title: newTask.title,
          date: format(newTask.date, 'yyyy-MM-dd'),
          type: newTask.type,
          priority: newTask.priority || 'medium',
          completed: false,
          user_id: user.id,
          position: nextPosition,
          is_recurring: newTask.is_recurring || false,
          recurrence_pattern: newTask.recurrence_pattern ? {
            frequency: newTask.recurrence_pattern.frequency,
            interval: newTask.recurrence_pattern.interval,
            endDate: newTask.recurrence_pattern.endDate
          } : null
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
        description: "Unable to add task",
        variant: "destructive",
      });
    }
  };

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

  return {
    tasks,
    isLoading,
    handleTaskCompletion,
    handleDeleteTask,
    handleAddTask,
    handleUpdateTaskPosition,
  };
};
