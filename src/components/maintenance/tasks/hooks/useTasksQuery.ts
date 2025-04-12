
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
      
      const formattedTasks = data.map(task => {
        // Convert dates to Date objects and normalize them (without hours/minutes/seconds)
        let taskDate: Date;
        try {
          if (task.date) {
            // If the date is a string, convert it to a Date object
            if (typeof task.date === 'string') {
              // Create a new date from the string
              try {
                taskDate = parseISO(task.date);
                
                // Add detailed logging for date parsing
                console.log(`Task ${task.id} date parsing:
                  - Original string: ${task.date}
                  - Parsed as: ${isValid(taskDate) ? format(taskDate, "yyyy-MM-dd") : "INVALID"}
                  - ISO string: ${isValid(taskDate) ? taskDate.toISOString() : "INVALID"}
                `);
              } catch (e) {
                console.error("Error parsing date string:", task.date, e);
                taskDate = startOfDay(new Date()); // Default date
              }
              
              // Check if the date is valid
              if (!isValid(taskDate)) {
                console.warn("Invalid date for task:", task.id, task.date);
                taskDate = startOfDay(new Date()); // Default date
              } else {
                // Normalize the date (without hours/minutes/seconds)
                taskDate = startOfDay(taskDate);
              }
            } else if (task.date instanceof Date) {
              // If it's already a Date object, normalize it
              taskDate = startOfDay(task.date);
            } else {
              console.warn("Unrecognized date format for task:", task.id);
              taskDate = startOfDay(new Date()); // Default date
            }
          } else {
            console.warn("No date for task:", task.id);
            taskDate = startOfDay(new Date()); // Default date
          }
          
          // Log the processed date for debugging
          const formattedDate = format(taskDate, "yyyy-MM-dd");
          console.log(`Task ${task.id} processed date: ${formattedDate}`);
        } catch (e) {
          console.error("Error processing date:", task.date, e);
          taskDate = startOfDay(new Date());
        }
        
        // Traiter la date de rappel
        let reminderDate = undefined;
        if (task.has_reminder && task.reminder_date) {
          try {
            if (typeof task.reminder_date === 'string') {
              try {
                reminderDate = parseISO(task.reminder_date);
                
                // Log pour le débogage
                console.log(`Task ${task.id} reminder date parsing:
                  - Original string: ${task.reminder_date}
                  - Parsed as: ${isValid(reminderDate) ? format(reminderDate, "yyyy-MM-dd") : "INVALID"}
                  - ISO string: ${isValid(reminderDate) ? reminderDate.toISOString() : "INVALID"}
                `);
              } catch (e) {
                console.error("Error parsing reminder date:", task.reminder_date, e);
                reminderDate = undefined;
              }
              
              if (!isValid(reminderDate)) {
                console.warn("Invalid reminder date for task:", task.id, task.reminder_date);
                reminderDate = undefined;
              } else {
                reminderDate = startOfDay(reminderDate);
              }
            } else if (task.reminder_date instanceof Date) {
              reminderDate = startOfDay(task.reminder_date);
            }
          } catch (e) {
            console.error("Error processing reminder date:", task.reminder_date, e);
            reminderDate = undefined;
          }
        }
        
        // Amélioration critique: Log détaillé pour les tâches avec rappels
        if (task.has_reminder) {
          console.log(`IMPORTANT - Found task with reminder: 
            ID: ${task.id}
            Title: ${task.title}
            has_reminder: ${task.has_reminder}
            reminder_date: ${task.reminder_date}
            reminder_date (parsed): ${reminderDate ? format(reminderDate, "yyyy-MM-dd") : "undefined"}
            reminder_method: ${task.reminder_method || "none"}
          `);
        }
        
        // Return the task with normalized dates
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
            end_date: task.recurrence_pattern.end_date ? startOfDay(new Date(task.recurrence_pattern.end_date)) : undefined
          } : undefined
        } as Task;
      });
      
      // Logs spécifiques pour les tâches avec rappels
      const reminderTasks = formattedTasks.filter(task => task.has_reminder && task.reminder_date);
      console.log(`Found ${reminderTasks.length} tasks with reminders after formatting`);
      
      if (reminderTasks.length > 0) {
        console.log("CRITICAL - Reminder task examples:", reminderTasks.slice(0, 3).map(t => ({ 
          id: t.id, 
          title: t.title,
          has_reminder: t.has_reminder,
          reminder_date: t.reminder_date instanceof Date ? format(t.reminder_date, "yyyy-MM-dd") : 'Invalid date',
          reminder_method: t.reminder_method
        })));
      }
      
      return formattedTasks;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    staleTime: 3000, // Consider data stale after 3 seconds to encourage refetching
  });

  // Fonction pour forcer le rafraîchissement des tâches
  const refreshTasks = () => {
    console.log("Manually refreshing tasks...");
    queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
  };

  return { tasks, isLoading, refreshTasks };
};
