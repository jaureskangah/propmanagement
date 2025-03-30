
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
        // Create base task object
        const formattedTask: Task = {
          ...task,
          date: new Date(task.date),
          type: task.type as "regular" | "inspection" | "seasonal",
          priority: (task.priority || "medium") as "low" | "medium" | "high" | "urgent",
          status: (task.status || "pending") as "pending" | "in_progress" | "completed",
          completed: Boolean(task.completed),
          is_recurring: Boolean(task.is_recurring),
          recurrence_pattern: task.recurrence_pattern ? {
            frequency: task.recurrence_pattern.frequency || "daily",
            interval: task.recurrence_pattern.interval || 1,
            weekdays: task.recurrence_pattern.weekdays || [],
            end_date: task.recurrence_pattern.end_date ? new Date(task.recurrence_pattern.end_date) : undefined
          } : undefined
        };
        
        // Add reminder if it exists with direct fields
        if (task.reminder_enabled) {
          formattedTask.reminder = {
            enabled: true,
            time: task.reminder_time || "09:00",
            date: task.reminder_date ? new Date(task.reminder_date) : new Date(task.date),
            notification_type: task.reminder_notification_type || "app",
            last_sent: null
          };
        }
        
        return formattedTask;
      });
      
      console.log("Processed tasks after fetch:", formattedTasks);
      console.log("Recurring tasks count:", formattedTasks.filter(task => task.is_recurring).length);
      console.log("Tasks with reminders count:", formattedTasks.filter(task => task.reminder?.enabled).length);
      
      return formattedTasks;
    },
  });

  // Debug filtering
  const recurringTasks = tasks.filter(task => task.is_recurring);
  const tasksWithReminders = tasks.filter(task => task.reminder?.enabled);
  
  console.log("Filtered recurring tasks:", recurringTasks);
  console.log("Filtered tasks with reminders:", tasksWithReminders);

  return { tasks, isLoading };
};
