
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
      
      // Create a task with all necessary properties
      const taskToAdd = {
        title: newTask.title,
        date: newTask.date,
        type: newTask.type,
        priority: newTask.priority || 'medium',
        is_recurring: newTask.is_recurring || false,
        recurrence_pattern: newTask.recurrence_pattern,
        // Add reminder fields directly to the task
        reminder_enabled: newTask.reminder?.enabled || false,
        reminder_time: newTask.reminder?.time || null,
        reminder_date: newTask.reminder?.date || null,
        reminder_notification_type: newTask.reminder?.notification_type || null
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
      // Prepare tasks to add with all necessary properties
      const tasksToAdd = newTasks.map(task => ({
        title: task.title,
        date: task.date,
        type: task.type,
        priority: task.priority || "medium",
        is_recurring: task.is_recurring || false,
        recurrence_pattern: task.recurrence_pattern,
        // Add reminder fields directly to the task
        reminder_enabled: task.reminder?.enabled || false,
        reminder_time: task.reminder?.time || null,
        reminder_date: task.reminder?.date || null,
        reminder_notification_type: task.reminder?.notification_type || null
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
