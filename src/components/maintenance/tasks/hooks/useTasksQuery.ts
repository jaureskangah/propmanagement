
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";
import { startOfDay, format, isValid, parseISO } from "date-fns";

export const useTasksQuery = () => {
  const queryClient = useQueryClient();

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
      console.log("Number of tasks retrieved:", data.length);

      // Compter les tâches avec des rappels dans les données brutes
      const rawReminders = data.filter(task => task.has_reminder === true);
      console.log(`Found ${rawReminders.length} raw tasks with reminders`);
      
      if (rawReminders.length > 0) {
        console.log("Example raw reminder tasks:", rawReminders.slice(0, 3).map(task => ({
          id: task.id,
          title: task.title,
          has_reminder: task.has_reminder,
          reminder_date: task.reminder_date,
          reminder_method: task.reminder_method
        })));
      }
      
      const formattedTasks = data.map(task => {
        // Normalisation de la date de la tâche
        let taskDate = startOfDay(new Date());
        try {
          if (task.date) {
            if (typeof task.date === 'string') {
              taskDate = parseISO(task.date);
              if (!isValid(taskDate)) {
                console.warn(`Invalid task date string for task ${task.id}: ${task.date}`);
                taskDate = startOfDay(new Date());
              } else {
                taskDate = startOfDay(taskDate);
              }
            } else if (task.date instanceof Date) {
              taskDate = startOfDay(task.date);
            }
          }
        } catch (e) {
          console.error(`Error processing task date for task ${task.id}:`, e);
          taskDate = startOfDay(new Date());
        }
        
        // Normalisation de la date de rappel
        let reminderDate = undefined;
        try {
          if (task.has_reminder && task.reminder_date) {
            if (typeof task.reminder_date === 'string') {
              reminderDate = parseISO(task.reminder_date);
              if (!isValid(reminderDate)) {
                console.warn(`Invalid reminder date string for task ${task.id}: ${task.reminder_date}`);
                reminderDate = undefined;
              } else {
                reminderDate = startOfDay(reminderDate);
                console.log(`Parsed reminder date for task ${task.id}: ${format(reminderDate, 'yyyy-MM-dd')}`);
              }
            } else if (task.reminder_date instanceof Date) {
              reminderDate = startOfDay(task.reminder_date);
              console.log(`Date object reminder date for task ${task.id}: ${format(reminderDate, 'yyyy-MM-dd')}`);
            } else {
              console.warn(`Unsupported reminder_date format for task ${task.id}:`, typeof task.reminder_date);
            }
          }
        } catch (e) {
          console.error(`Error processing reminder date for task ${task.id}:`, e);
        }
        
        // Forcer explicitement le booléen has_reminder
        const hasReminder = task.has_reminder === true;
        
        // Log détaillé pour les tâches avec rappels
        if (hasReminder) {
          console.log(`Task with reminder after processing: 
            ID: ${task.id}
            Title: ${task.title}
            has_reminder: ${hasReminder}
            reminder_date: ${reminderDate ? format(reminderDate, 'yyyy-MM-dd') : 'undefined'}
            reminder_method: ${task.reminder_method || 'app'}
          `);
        }
        
        return {
          ...task,
          date: taskDate,
          type: (task.type || "regular") as "regular" | "inspection" | "seasonal",
          priority: (task.priority || "medium") as "low" | "medium" | "high" | "urgent",
          status: (task.status || "pending") as "pending" | "in_progress" | "completed",
          completed: Boolean(task.completed),
          is_recurring: Boolean(task.is_recurring),
          has_reminder: hasReminder,
          reminder_date: reminderDate,
          reminder_method: task.reminder_method || "app",
          recurrence_pattern: task.recurrence_pattern ? {
            frequency: task.recurrence_pattern.frequency || "daily",
            interval: task.recurrence_pattern.interval || 1,
            weekdays: task.recurrence_pattern.weekdays || [],
            end_date: task.recurrence_pattern.end_date 
              ? startOfDay(new Date(task.recurrence_pattern.end_date)) 
              : undefined
          } : undefined
        } as Task;
      });
      
      // Log final des tâches avec rappels
      const finalReminderTasks = formattedTasks.filter(task => task.has_reminder && task.reminder_date);
      console.log(`Final count of tasks with reminders: ${finalReminderTasks.length}`);
      
      return formattedTasks;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000,      // Consider data stale after 15 seconds
  });

  // Fonction pour forcer le rafraîchissement des tâches
  const refreshTasks = () => {
    console.log("Manually refreshing tasks...");
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
  };

  return { tasks, isLoading, refreshTasks };
};
