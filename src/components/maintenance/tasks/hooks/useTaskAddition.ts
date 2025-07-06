
import { supabase } from "@/lib/supabase";
import { Task, NewTask } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { formatLocalDateForStorage } from "../../utils/dateUtils";

export const useTaskAddition = () => {
  const queryClient = useQueryClient();

  const handleAddTask = async (newTask: NewTask): Promise<Task> => {
    console.log("Adding task with data:", newTask);
    console.log("Property ID being used:", newTask.property_id);
    
    try {
      // Check if we received a formatted date string from AddTaskDialog
      let formattedDate: string;
      
      if (typeof newTask.date === 'string' && typeof newTask.date === 'string' && newTask.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Already formatted as YYYY-MM-DD, use as is
        formattedDate = newTask.date;
        console.log("Using pre-formatted date string:", formattedDate);
      } else {
        // Format the date to YYYY-MM-DD
        const dateObj = newTask.date instanceof Date 
          ? newTask.date 
          : typeof newTask.date === 'string'
            ? new Date(newTask.date)
            : new Date();
        
        formattedDate = formatLocalDateForStorage(dateObj);
        console.log("Formatted date from date object:", formattedDate, "Original:", dateObj);
      }
      
      // Format reminder date if present
      let formattedReminderDate: string | undefined = undefined;
      if (newTask.has_reminder && newTask.reminder_date) {
        if (newTask.reminder_date instanceof Date) {
          formattedReminderDate = formatLocalDateForStorage(newTask.reminder_date);
        } else if (typeof newTask.reminder_date === 'string') {
          formattedReminderDate = newTask.reminder_date;
        }
        console.log("Formatted reminder date:", formattedReminderDate);
      }
      
      // Log all date information for diagnosis
      console.log("=== TASK DATE DIAGNOSIS ===");
      console.log("Original task date:", newTask.date);
      console.log("Final formatted date for DB:", formattedDate);
      console.log("Has reminder:", newTask.has_reminder);
      console.log("Reminder date:", formattedReminderDate);
      console.log("Reminder method:", newTask.reminder_method);
      console.log("=============================");
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Prepare the task data to insert with the properly formatted date and reminder data
      const taskData = {
        title: newTask.title,
        type: newTask.type || "regular",
        priority: newTask.priority || "medium",
        date: formattedDate, // Use our formatted date string
        is_recurring: newTask.is_recurring || false,
        user_id: user.id,
        property_id: newTask.property_id,
        // Add reminder fields
        has_reminder: newTask.has_reminder || false,
        ...(newTask.has_reminder && formattedReminderDate ? { reminder_date: formattedReminderDate } : {}),
        ...(newTask.has_reminder && newTask.reminder_method ? { reminder_method: newTask.reminder_method } : {}),
        // Add recurrence pattern
        ...(newTask.recurrence_pattern ? { recurrence_pattern: newTask.recurrence_pattern } : {}),
      };
      
      console.log("Task data being inserted:", taskData);
      
      // Insert the task
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(taskData)
        .select('*')
        .single();
        
      if (error) {
        console.error("Error inserting task:", error);
        throw error;
      }
      
      console.log("Task inserted successfully:", data);
      console.log("Invalidating cache for property:", newTask.property_id);
      
      // Immediately invalidate the tasks query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks', newTask.property_id] });
      
      // Parse the date string back to a Date object for the returned Task
      const parsedDate = new Date(formattedDate + 'T00:00:00');
      const parsedReminderDate = data.reminder_date ? new Date(data.reminder_date + 'T00:00:00') : undefined;
      console.log("Parsed date for return:", parsedDate);
      console.log("Parsed reminder date for return:", parsedReminderDate);
      
      return {
        ...data,
        date: parsedDate, // Return the exact date that was selected
        reminder_date: parsedReminderDate, // Return the parsed reminder date
        completed: false,
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
        // Format date to YYYY-MM-DD regardless of input type
        let formattedDate: string;
        
        if (typeof task.date === 'string' && typeof task.date === 'string' && task.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Already formatted as YYYY-MM-DD, use as is
          formattedDate = task.date;
          console.log(`Task "${task.title}" using pre-formatted date string:`, formattedDate);
        } else {
          // Format the date to YYYY-MM-DD
          const dateObj = task.date instanceof Date 
            ? task.date 
            : typeof task.date === 'string'
              ? new Date(task.date)
              : new Date();
          
          formattedDate = formatLocalDateForStorage(dateObj);
          console.log(`Task "${task.title}" formatted date:`, formattedDate, "Original:", dateObj);
        }
        
        // Format reminder date if present
        let formattedReminderDate: string | undefined = undefined;
        if (task.has_reminder && task.reminder_date) {
          if (task.reminder_date instanceof Date) {
            formattedReminderDate = formatLocalDateForStorage(task.reminder_date);
          } else if (typeof task.reminder_date === 'string') {
            formattedReminderDate = task.reminder_date;
          }
        }
        
        return {
          title: task.title,
          type: task.type || "regular",
          priority: task.priority || "medium",
          date: formattedDate, // Use our safely formatted date
          is_recurring: task.is_recurring || false,
          user_id: user.id,
          property_id: task.property_id,
          // Add reminder fields
          has_reminder: task.has_reminder || false,
          ...(task.has_reminder && formattedReminderDate ? { reminder_date: formattedReminderDate } : {}),
          ...(task.has_reminder && task.reminder_method ? { reminder_method: task.reminder_method } : {}),
          // Add recurrence pattern
          ...(task.recurrence_pattern ? { recurrence_pattern: task.recurrence_pattern } : {}),
        };
      });
      
      console.log("Tasks data being inserted:", tasksToInsert);
      
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
      
      // Get unique property IDs for cache invalidation
      const propertyIds = [...new Set(newTasks.map(task => task.property_id))];
      console.log("Invalidating cache for properties:", propertyIds);
      
      // Immediately invalidate the tasks query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      propertyIds.forEach(propertyId => {
        if (propertyId) {
          queryClient.invalidateQueries({ queryKey: ['maintenance_tasks', propertyId] });
        }
      });
      
      // Transform the returned data to Task objects with correct dates
      return data.map((task: any) => {
        // Reconstruct the date from the stored formatted string
        // Adding T00:00:00 ensures consistent parsing behavior
        const parsedDate = new Date(task.date + 'T00:00:00');
        const parsedReminderDate = task.reminder_date ? new Date(task.reminder_date + 'T00:00:00') : undefined;
        
        return {
          ...task,
          date: parsedDate,
          reminder_date: parsedReminderDate,
          completed: false,
        };
      }) as Task[];
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
