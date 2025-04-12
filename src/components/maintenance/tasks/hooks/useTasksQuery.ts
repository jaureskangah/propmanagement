
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";
import { startOfDay, format } from "date-fns";

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
      console.log("Number of tasks retrieved:", data.length);
      
      const formattedTasks = data.map(task => {
        // Convert dates to Date objects and normalize them (without hours/minutes/seconds)
        let taskDate;
        try {
          if (task.date) {
            // If the date is a string, convert it to a Date object
            if (typeof task.date === 'string') {
              // Create a new date from the string
              taskDate = new Date(task.date);
              
              // Check if the date is valid
              if (isNaN(taskDate.getTime())) {
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
          console.log(`Task ${task.id} date: ${task.date} → ${format(taskDate, "yyyy-MM-dd")}`);
        } catch (e) {
          console.error("Error processing date:", task.date, e);
          taskDate = startOfDay(new Date());
        }
        
        let reminderDate = undefined;
        if (task.reminder_date) {
          try {
            if (typeof task.reminder_date === 'string') {
              reminderDate = new Date(task.reminder_date);
              if (isNaN(reminderDate.getTime())) {
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
      
      console.log("Tasks processed after retrieval:", formattedTasks.length);
      console.log("Task examples:", formattedTasks.slice(0, 3).map(t => ({ 
        id: t.id, 
        title: t.title,
        date: t.date instanceof Date ? format(t.date, "yyyy-MM-dd") : 'Invalid date',
        type: t.type,
        priority: t.priority
      })));
      
      return formattedTasks;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    staleTime: 3000, // Consider data stale after 3 seconds to encourage refetching
  });

  return { tasks, isLoading };
};
