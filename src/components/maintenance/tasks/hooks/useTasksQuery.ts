
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";

export const useTasksQuery = () => {
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
      
      console.log("Raw task data from Supabase:", data);
      
      const formattedTasks = data.map(task => {
        // Normalisation des structures pour garantir la conformité à l'interface Task
        return {
          ...task,
          date: new Date(task.date),
          type: task.type as "regular" | "inspection" | "seasonal",
          priority: (task.priority || "medium") as "low" | "medium" | "high" | "urgent",
          status: (task.status || "pending") as "pending" | "in_progress" | "completed",
          completed: Boolean(task.completed),
          is_recurring: Boolean(task.is_recurring),
          has_reminder: Boolean(task.has_reminder),
          reminder_date: task.reminder_date ? new Date(task.reminder_date) : undefined,
          recurrence_pattern: task.recurrence_pattern ? {
            frequency: task.recurrence_pattern.frequency || "daily",
            interval: task.recurrence_pattern.interval || 1,
            weekdays: task.recurrence_pattern.weekdays || [],
            end_date: task.recurrence_pattern.end_date ? new Date(task.recurrence_pattern.end_date) : undefined
          } : undefined
        } as Task;
      });
      
      console.log("Processed tasks after fetch:", formattedTasks);
      console.log("Recurring tasks count:", formattedTasks.filter(task => task.is_recurring).length);
      console.log("Reminder tasks count:", formattedTasks.filter(task => task.has_reminder).length);
      
      return formattedTasks;
    },
  });

  // Filtre des tâches récurrentes (utile pour le débogage)
  const recurringTasks = tasks.filter(task => task.is_recurring);
  console.log("Filtered recurring tasks:", recurringTasks);
  
  // Filtre des tâches avec rappel (utile pour le débogage)
  const reminderTasks = tasks.filter(task => task.has_reminder);
  console.log("Filtered reminder tasks:", reminderTasks);

  return { tasks, isLoading };
};
