
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
      const selectedDate = newTask.date instanceof Date 
        ? newTask.date 
        : typeof newTask.date === 'string' 
          ? new Date(newTask.date) 
          : new Date();
      
      // Log all date information for diagnosis
      console.log("=== TASK DATE DIAGNOSIS ===");
      console.log("Original task date:", newTask.date);
      console.log("Selected date object:", selectedDate);
      console.log(`Selected date (local): ${selectedDate.toLocaleDateString()}`);
      console.log(`Date components: Year=${selectedDate.getFullYear()}, Month=${selectedDate.getMonth() + 1}, Day=${selectedDate.getDate()}`);
      
      // Create ISO date string (YYYY-MM-DD) directly from components
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log(`Formatted date for database: ${formattedDate}`);
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
        property_id: newTask.property_id, // Ensure property_id is included
        // Add other fields as needed
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
        date: selectedDate, // Return the selected date object
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
        const selectedDate = task.date instanceof Date 
          ? task.date 
          : typeof task.date === 'string' 
            ? new Date(task.date) 
            : new Date();
        
        // Create ISO date string (YYYY-MM-DD) directly from components
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
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
      
      // Transform the returned data to Task objects
      return data.map((task: any) => {
        // Parse the date string from the database back to a Date object
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
