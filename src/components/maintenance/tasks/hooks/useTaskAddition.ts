
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
          property_id: newTask.property_id, // Ajout du property_id
          // Add other fields as needed
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
        
        return {
          title: task.title,
          type: task.type || "regular",
          priority: task.priority || "medium",
          date: normalizedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          is_recurring: task.is_recurring || false,
          user_id: user.id,
          property_id: task.property_id, // Ajout du property_id
          // Add other fields as needed
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
