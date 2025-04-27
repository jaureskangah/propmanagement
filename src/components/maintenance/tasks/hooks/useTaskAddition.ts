
import { supabase } from "@/lib/supabase";
import { Task, NewTask } from "../../types";
import { QueryClient } from "@tanstack/react-query";

export const useTaskAddition = () => {
  const queryClient = new QueryClient();

  const handleAddTask = async (newTask: NewTask): Promise<Task> => {
    console.log("Adding task with data:", newTask);
    try {
      // Get the date directly from the task or use current date as fallback
      const dateToUse = newTask.date instanceof Date 
        ? newTask.date 
        : typeof newTask.date === 'string' 
          ? new Date(newTask.date) 
          : new Date();
      
      // Log all date information for diagnosis
      console.log("=== TASK DATE DIAGNOSIS ===");
      console.log("Original task date:", newTask.date);
      console.log("Selected date object:", dateToUse);
      console.log(`Selected date (local): ${dateToUse.toLocaleDateString()}`);
      
      // CRITICAL FIX: Always use the *local* date components as displayed to user
      // This eliminates timezone issues completely
      const year = dateToUse.getFullYear();
      const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
      const day = String(dateToUse.getDate()).padStart(2, '0');
      
      // Create the date string in YYYY-MM-DD format from local components
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log(`⚠️ FORMATTED DATE FOR DB: ${formattedDate}`);
      console.log("=============================");
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Prepare the task data to insert
      const taskData = {
        title: newTask.title,
        type: newTask.type || "regular",
        priority: newTask.priority || "medium",
        date: formattedDate, // Use our formatted date
        is_recurring: newTask.is_recurring || false,
        user_id: user.id,
        property_id: newTask.property_id,
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
      
      // Immediately invalidate the tasks query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      return {
        ...data,
        date: dateToUse, // Return the exact date object that was selected
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
        const dateToUse = task.date instanceof Date 
          ? task.date 
          : typeof task.date === 'string' 
            ? new Date(task.date) 
            : new Date();
        
        // CRITICAL FIX: Extract date components directly from the local date object
        const year = dateToUse.getFullYear();
        const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
        const day = String(dateToUse.getDate()).padStart(2, '0');
        
        // Create date string in YYYY-MM-DD format
        const formattedDate = `${year}-${month}-${day}`;
        
        console.log(`Task "${task.title}" formatted date: ${formattedDate}`);
        
        return {
          title: task.title,
          type: task.type || "regular",
          priority: task.priority || "medium",
          date: formattedDate, // Use our formatted date
          is_recurring: task.is_recurring || false,
          user_id: user.id,
          property_id: task.property_id,
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
      
      // Immediately invalidate the tasks query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Transform the returned data to Task objects with correct dates
      return data.map((task: any) => {
        // Reconstruct the date from the database formatted string
        const dateParts = task.date.split('-');
        const taskDate = new Date(
          parseInt(dateParts[0]), // year
          parseInt(dateParts[1]) - 1, // month (0-indexed)
          parseInt(dateParts[2]) // day
        );
        
        return {
          ...task,
          date: taskDate,
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
