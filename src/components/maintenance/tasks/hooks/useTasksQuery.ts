
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
      
      return data.map(task => ({
        ...task,
        date: new Date(task.date),
        type: task.type as "regular" | "inspection" | "seasonal",
        priority: (task.priority || "medium") as "low" | "medium" | "high" | "urgent",
        status: (task.status || "pending") as "pending" | "in_progress" | "completed",
        completed: Boolean(task.completed),
        is_recurring: Boolean(task.is_recurring),
        recurrence_pattern: task.recurrence_pattern ? {
          frequency: (task.recurrence_pattern as any).frequency || "daily",
          interval: (task.recurrence_pattern as any).interval || 1,
          weekdays: (task.recurrence_pattern as any).weekdays || [],
          end_date: (task.recurrence_pattern as any).end_date ? new Date((task.recurrence_pattern as any).end_date) : undefined
        } : undefined
      })) as Task[];
    },
  });

  // Add debugging to check for recurring tasks
  console.log("Processed tasks after fetch:", tasks);
  console.log("Recurring tasks count:", tasks.filter(task => task.is_recurring).length);

  return { tasks, isLoading };
};
