
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
      console.log("Number of tasks retrieved:", data.length);
      
      const formattedTasks = data.map(task => {
        // Properly parse date strings to Date objects
        let taskDate;
        try {
          if (task.date) {
            // Parse the date string to ensure it's correctly formatted
            const dateStr = typeof task.date === 'string' 
              ? task.date.split('T')[0] // Split to handle ISO strings
              : task.date;
              
            // Create a new Date object with the date parts to avoid timezone issues
            const dateParts = dateStr.split('-').map(part => parseInt(part, 10));
            if (dateParts.length === 3) {
              // year, month (0-based in JS Date), day
              taskDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
              console.log(`Parsed date for task ${task.id}: ${dateStr} -> ${taskDate.toISOString()}`);
            } else {
              taskDate = new Date(dateStr);
              console.log(`Simple parse for task ${task.id}: ${dateStr} -> ${taskDate.toISOString()}`);
            }
            
            // Verify the date is valid
            if (isNaN(taskDate.getTime())) {
              console.warn("Invalid date found for task:", task.id, task.date);
              taskDate = new Date(); // Fallback to current date
            }
          } else {
            console.warn("No date found for task:", task.id);
            taskDate = new Date(); // Fallback to current date
          }
        } catch (e) {
          console.error("Error parsing date:", task.date, e);
          taskDate = new Date();
        }
        
        let reminderDate = undefined;
        if (task.reminder_date) {
          try {
            // Parse reminder date with similar approach
            const reminderDateStr = typeof task.reminder_date === 'string'
              ? task.reminder_date.split('T')[0]
              : task.reminder_date;
              
            const dateParts = reminderDateStr.split('-').map(part => parseInt(part, 10));
            if (dateParts.length === 3) {
              // year, month (0-based in JS Date), day
              reminderDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            } else {
              reminderDate = new Date(reminderDateStr);
            }
            
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
      
      console.log("Processed tasks after fetch:", formattedTasks.length);
      console.log("Task examples:", formattedTasks.slice(0, 3).map(t => ({ 
        id: t.id, 
        title: t.title,
        date: t.date.toISOString(),
        type: t.type,
        priority: t.priority
      })));
      
      return formattedTasks;
    },
    refetchInterval: 5000, // Augmenter la fréquence de rafraîchissement pour voir les changements plus rapidement
  });

  return { tasks, isLoading };
};
