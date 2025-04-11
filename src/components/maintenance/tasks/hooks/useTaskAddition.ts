
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { NewTask } from "../../types";

export const useTaskAddition = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: NewTask) => {
      console.log("Adding new task with data:", newTask);
      
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Ensure we have a properly formatted date
      const taskDate = newTask.date instanceof Date
        ? newTask.date
        : new Date(newTask.date);
      
      // Format the date as an ISO string for Supabase
      const dateString = taskDate.toISOString().split('T')[0];
      
      console.log("Normalized task date for database:", dateString);

      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert([
          {
            title: newTask.title,
            description: newTask.description || '',
            status: 'pending',
            priority: newTask.priority,
            due_date: newTask.deadline,
            date: dateString, // Use formatted date
            type: newTask.type,
            is_recurring: newTask.is_recurring || false,
            recurrence_pattern: newTask.recurrence_pattern,
            user_id: user.id,
            completed: false,
            tenant_id: newTask.tenant_id,
            property_id: newTask.property_id,
            has_reminder: newTask.has_reminder || false,
            reminder_date: newTask.reminder_date ? new Date(newTask.reminder_date).toISOString().split('T')[0] : null,
            reminder_method: newTask.reminder_method
          }
        ])
        .select();

      if (error) {
        console.error("Error adding task:", error);
        throw error;
      }
      
      console.log("Task added successfully:", data);
      return data;
    },
    onSuccess: () => {
      console.log("Invalidating maintenance_tasks query after adding task");
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    }
  });

  const addMultipleTasksMutation = useMutation({
    mutationFn: async (newTasks: NewTask[]) => {
      console.log("Adding multiple tasks with data:", newTasks);

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const tasks = newTasks.map(task => {
        // Ensure proper date formatting for each task
        const taskDate = task.date instanceof Date
          ? task.date
          : new Date(task.date);
          
        // Format the date as an ISO string for Supabase
        const dateString = taskDate.toISOString().split('T')[0];
        
        return {
          title: task.title,
          description: task.description || '',
          status: 'pending',
          priority: task.priority,
          due_date: task.deadline,
          date: dateString, // Use formatted date
          type: task.type,
          is_recurring: task.is_recurring || false,
          recurrence_pattern: task.recurrence_pattern,
          user_id: user.id,
          completed: false,
          tenant_id: task.tenant_id,
          property_id: task.property_id,
          has_reminder: task.has_reminder || false,
          reminder_date: task.reminder_date ? new Date(task.reminder_date).toISOString().split('T')[0] : null,
          reminder_method: task.reminder_method
        };
      });

      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(tasks)
        .select();

      if (error) {
        console.error("Error adding multiple tasks:", error);
        throw error;
      }
      
      console.log("Multiple tasks added successfully:", data);
      return data;
    },
    onSuccess: () => {
      console.log("Invalidating maintenance_tasks query after adding multiple tasks");
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    }
  });

  return {
    handleAddTask: (newTask: NewTask) => addTaskMutation.mutateAsync(newTask),
    handleAddMultipleTasks: (newTasks: NewTask[]) => addMultipleTasksMutation.mutateAsync(newTasks),
    isAddingTask: addTaskMutation.isPending,
    isAddingMultipleTasks: addMultipleTasksMutation.isPending
  };
};
