
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { NewTask } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useTaskAddition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLocale();

  // Function to add a new task
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: NewTask) => {
      console.log("Adding task with date:", newTask.date, "Original date:", newTask.date);
      
      // Log if the task is recurring
      console.log("Task is recurring:", newTask.is_recurring);
      if (newTask.is_recurring && newTask.recurrence_pattern) {
        console.log("Recurrence pattern:", newTask.recurrence_pattern);
      }
      
      // Log if the task has a reminder
      if (newTask.reminder) {
        console.log("Reminder settings:", newTask.reminder);
      }
      
      // Create a copy of the task without unsupported properties
      const taskToAdd = {
        title: newTask.title,
        date: newTask.date,
        type: newTask.type,
        priority: newTask.priority || 'medium',
        is_recurring: newTask.is_recurring || false,
        recurrence_pattern: newTask.recurrence_pattern,
        // Store reminder info in metadata field
        metadata: newTask.reminder ? {
          reminder: {
            ...newTask.reminder,
            date: newTask.reminder.date ? newTask.reminder.date : newTask.date
          }
        } : null
      };
      
      console.log("Task being inserted into Supabase:", taskToAdd);
      
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(taskToAdd)
        .select();
      
      if (error) {
        console.error("Error adding task:", error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    },
    onError: (error) => {
      console.error("Error adding task:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTasks'),
        variant: "destructive",
      });
    },
  });

  // Function to add multiple tasks
  const addMultipleTasksMutation = useMutation({
    mutationFn: async (newTasks: NewTask[]) => {
      // Prepare tasks to add without unsupported properties
      const tasksToAdd = newTasks.map(task => ({
        title: task.title,
        date: task.date,
        type: task.type,
        priority: task.priority || "medium",
        is_recurring: task.is_recurring || false,
        recurrence_pattern: task.recurrence_pattern,
        metadata: task.reminder ? {
          reminder: {
            ...task.reminder,
            date: task.reminder.date ? task.reminder.date : task.date
          }
        } : null
      }));
      
      console.log("Multiple tasks being inserted:", tasksToAdd);
      
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(tasksToAdd)
        .select();
      
      if (error) {
        console.error("Error adding multiple tasks:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    },
    onError: (error) => {
      console.error("Error adding multiple tasks:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTasks'),
        variant: "destructive",
      });
    },
  });

  return {
    handleAddTask: (task: NewTask) => addTaskMutation.mutate(task),
    handleAddMultipleTasks: (tasks: NewTask[]) => addMultipleTasksMutation.mutate(tasks),
    isAdding: addTaskMutation.isPending,
    isAddingMultiple: addMultipleTasksMutation.isPending,
  };
};
