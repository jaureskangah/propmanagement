
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
        // Properly parse date strings to Date objects
        let taskDate;
        try {
          taskDate = task.date ? new Date(task.date) : new Date();
          // Verify the date is valid
          if (isNaN(taskDate.getTime())) {
            console.warn("Invalid date found for task:", task.id, task.date);
            taskDate = new Date(); // Fallback to current date
          }
        } catch (e) {
          console.error("Error parsing date:", task.date, e);
          taskDate = new Date();
        }
        
        let reminderDate = undefined;
        if (task.reminder_date) {
          try {
            // Parse reminder date
            reminderDate = new Date(task.reminder_date);
            if (isNaN(reminderDate.getTime())) {
              console.warn("Invalid reminder date found for task:", task.id, task.reminder_date);
              reminderDate = undefined;
            }
          } catch (e) {
            console.error("Error parsing reminder date:", task.reminder_date, e);
            reminderDate = undefined;
          }
        }
        
        // Normalisation des structures pour garantir la conformité à l'interface Task
        return {
          ...task,
          date: taskDate,
          type: (task.type || "regular") as "regular" | "inspection" | "seasonal",
          priority: (task.priority || "medium") as "low" | "medium" | "high" | "urgent",
          status: (task.status || "pending") as "pending" | "in_progress" | "completed",
          completed: Boolean(task.completed),
          is_recurring: Boolean(task.is_recurring),
          has_reminder: Boolean(task.has_reminder),
          reminder_date: reminderDate,
          reminder_method: task.reminder_method || "app",
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

  // Plus de logs pour diagnostiquer les problèmes
  console.log("All tasks:", tasks);
  console.log("Recurring tasks:", tasks.filter(task => task.is_recurring));
  console.log("Reminder tasks:", tasks.filter(task => task.has_reminder));

  return { tasks, isLoading };
};
