
import { supabase } from "@/lib/supabase";
import { Task, NewTask } from "../../types";
import { QueryClient } from "@tanstack/react-query";
import { startOfDay, format } from "date-fns";

export const useTaskAddition = () => {
  const queryClient = new QueryClient();

  const handleAddTask = async (newTask: NewTask): Promise<Task> => {
    console.log("Adding task with data:", newTask);
    try {
      // Ensure the task has normalized dates
      const normalizedDate = startOfDay(newTask.date instanceof Date 
        ? newTask.date 
        : typeof newTask.date === 'string' 
          ? new Date(newTask.date) 
          : new Date());
      
      console.log("Normalized task date for insertion:", format(normalizedDate, "yyyy-MM-dd"));
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Normaliser la date de rappel si elle existe
      let normalizedReminderDate = undefined;
      if (newTask.has_reminder && newTask.reminder_date) {
        normalizedReminderDate = startOfDay(newTask.reminder_date instanceof Date 
          ? newTask.reminder_date 
          : typeof newTask.reminder_date === 'string' 
            ? new Date(newTask.reminder_date) 
            : new Date());
            
        console.log("Normalized reminder date for insertion:", format(normalizedReminderDate, "yyyy-MM-dd"));
        console.log("CRITICAL: Inserting task with reminder data:", {
          has_reminder: newTask.has_reminder,
          reminder_date: normalizedReminderDate.toISOString().split('T')[0],
          reminder_method: newTask.reminder_method
        });
      }
      
      // Insert the task
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert({
          title: newTask.title,
          type: newTask.type || "regular",
          priority: newTask.priority || "medium",
          date: normalizedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          is_recurring: newTask.is_recurring || false,
          user_id: user.id,
          // Add reminder fields
          has_reminder: newTask.has_reminder || false,
          reminder_date: newTask.has_reminder && normalizedReminderDate 
            ? normalizedReminderDate.toISOString().split('T')[0] 
            : null,
          reminder_method: newTask.has_reminder ? newTask.reminder_method : null,
          // Add recurrence pattern if needed
          ...(newTask.recurrence_pattern ? { recurrence_pattern: newTask.recurrence_pattern } : {}),
        })
        .select('*')
        .single();
        
      if (error) {
        console.error("Error inserting task:", error);
        throw error;
      }
      
      console.log("Task inserted successfully:", data);
      
      // Immediately invalidate the tasks query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      
      return {
        ...data,
        date: normalizedDate,
        completed: false,
        reminder_date: newTask.has_reminder && normalizedReminderDate ? normalizedReminderDate : undefined,
      } as Task;
    } catch (error) {
      console.error("Error in handleAddTask:", error);
      throw error;
    }
  };

  const handleAddMultipleTasks = async (newTasks: NewTask[]): Promise<Task[]> => {
    console.log("Adding multiple tasks:", newTasks.length);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Prepare tasks for insertion with proper date formatting
      const tasksToInsert = newTasks.map(task => {
        const normalizedDate = startOfDay(task.date instanceof Date 
          ? task.date 
          : typeof task.date === 'string' 
            ? new Date(task.date) 
            : new Date());
        
        // Normaliser la date de rappel si elle existe
        let normalizedReminderDate = undefined;
        if (task.has_reminder && task.reminder_date) {
          normalizedReminderDate = startOfDay(task.reminder_date instanceof Date 
            ? task.reminder_date 
            : typeof task.reminder_date === 'string' 
              ? new Date(task.reminder_date) 
              : new Date());
              
          console.log(`CRITICAL: Batch task with reminder:
            Title: ${task.title}
            has_reminder: ${task.has_reminder}
            reminder_date: ${normalizedReminderDate.toISOString().split('T')[0]}
            reminder_method: ${task.reminder_method}
          `);
        }
        
        return {
          title: task.title,
          type: task.type || "regular",
          priority: task.priority || "medium",
          date: normalizedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          is_recurring: task.is_recurring || false,
          user_id: user.id,
          // Add reminder fields
          has_reminder: task.has_reminder || false,
          reminder_date: task.has_reminder && normalizedReminderDate 
            ? normalizedReminderDate.toISOString().split('T')[0] 
            : null,
          reminder_method: task.has_reminder ? task.reminder_method : null,
          // Add recurrence pattern if needed
          ...(task.recurrence_pattern ? { recurrence_pattern: task.recurrence_pattern } : {}),
        };
      });
      
      // Insert all tasks
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(tasksToInsert)
        .select('*');
        
      if (error) {
        console.error("Error inserting multiple tasks:", error);
        throw error;
      }
      
      console.log("Multiple tasks inserted successfully:", data);
      
      // Immediately invalidate the tasks query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      
      // Transform the returned data to Task objects
      return data.map((task: any) => ({
        ...task,
        date: startOfDay(new Date(task.date)),
        completed: false,
        reminder_date: task.has_reminder && task.reminder_date ? startOfDay(new Date(task.reminder_date)) : undefined,
      })) as Task[];
    } catch (error) {
      console.error("Error in handleAddMultipleTasks:", error);
      throw error;
    }
  };

  return {
    handleAddTask,
    handleAddMultipleTasks,
  };
};
