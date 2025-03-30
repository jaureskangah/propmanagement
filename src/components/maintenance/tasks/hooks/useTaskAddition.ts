
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

      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert([
          {
            title: newTask.title,
            description: newTask.description || '',
            status: 'pending',
            priority: newTask.priority,
            due_date: newTask.deadline,
            date: newTask.date,
            type: newTask.type,
            is_recurring: newTask.is_recurring || false,
            recurrence_pattern: newTask.recurrence_pattern,
            user_id: user.id,
            completed: false,
            tenant_id: newTask.tenant_id,
            property_id: newTask.property_id,
            has_reminder: newTask.has_reminder || false,
            reminder_date: newTask.reminder_date
          }
        ])
        .select();

      if (error) {
        console.error("Error adding task:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_tasks'] });
    }
  });

  const addMultipleTasksMutation = useMutation({
    mutationFn: async (newTasks: NewTask[]) => {
      console.log("Adding multiple tasks with data:", newTasks);

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const tasks = newTasks.map(task => ({
        title: task.title,
        description: task.description || '',
        status: 'pending',
        priority: task.priority,
        due_date: task.deadline,
        date: task.date,
        type: task.type,
        is_recurring: task.is_recurring || false,
        recurrence_pattern: task.recurrence_pattern,
        user_id: user.id,
        completed: false,
        tenant_id: task.tenant_id,
        property_id: task.property_id,
        has_reminder: task.has_reminder || false,
        reminder_date: task.reminder_date
      }));

      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert(tasks)
        .select();

      if (error) {
        console.error("Error adding multiple tasks:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
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
