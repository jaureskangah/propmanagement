
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { NewTask } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useTaskAddition = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLocale();

  // Fonction pour ajouter une nouvelle tâche
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: NewTask) => {
      console.log("Adding task with date:", newTask.date, "Original date:", newTask.date);
      
      // Log si la tâche est récurrente
      console.log("Task is recurring:", newTask.is_recurring);
      if (newTask.is_recurring && newTask.recurrence_pattern) {
        console.log("Recurrence pattern:", newTask.recurrence_pattern);
      }
      
      // Log si la tâche a un rappel
      if (newTask.reminder) {
        console.log("Reminder settings:", newTask.reminder);
      }
      
      // Créer une copie de la tâche sans les propriétés non supportées
      const taskToAdd = {
        title: newTask.title,
        date: newTask.date,
        type: newTask.type,
        priority: newTask.priority,
        is_recurring: newTask.is_recurring,
        recurrence_pattern: newTask.recurrence_pattern,
        // Stockons les infos de rappel dans un champ metadata plutôt qu'utiliser reminder directement
        metadata: {
          reminder: newTask.reminder
        }
      };
      
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

  // Fonction pour ajouter plusieurs tâches
  const addMultipleTasksMutation = useMutation({
    mutationFn: async (newTasks: NewTask[]) => {
      // Préparer les tâches à ajouter sans les propriétés non supportées
      const tasksToAdd = newTasks.map(task => ({
        title: task.title,
        date: task.date,
        type: task.type,
        priority: task.priority || "medium",
        is_recurring: task.is_recurring || false,
        recurrence_pattern: task.recurrence_pattern,
        metadata: {
          reminder: task.reminder
        }
      }));
      
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
