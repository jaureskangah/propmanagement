
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
        // Extract reminder info from metadata if available
        const metadata = task.metadata || {};
        const reminderInfo = metadata.reminder || null;
        
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
        
        // Only add reminder if it exists in metadata and is enabled
        if (reminderInfo && reminderInfo.enabled) {
          formattedTask.reminder = {
            enabled: true,
            time: reminderInfo.time || "09:00",
            date: reminderInfo.date ? new Date(reminderInfo.date) : new Date(task.date),
            notification_type: reminderInfo.notification_type || "app",
            last_sent: reminderInfo.last_sent
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
