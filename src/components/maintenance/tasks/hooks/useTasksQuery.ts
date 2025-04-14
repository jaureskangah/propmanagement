
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";

export const useTasksQuery = (propertyId: string | undefined = undefined) => {
  const result = useQuery({
    queryKey: ['tasks', propertyId],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_tasks')
        .select('*');
      
      // If there's a specific property, filter by that property
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('date');
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Sort tasks with uncompleted ones first
      const sortedTasks = data.sort((a, b) => {
        // First sort by completed status
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        
        // Then sort by date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        if (isNaN(dateA) || isNaN(dateB)) {
          return 0;
        }
        
        return dateA - dateB;
      });
      
      return sortedTasks as Task[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Return structured data with additional helper methods
  return {
    tasks: result.data || [],
    isLoading: result.isLoading,
    error: result.error,
    refreshTasks: () => result.refetch()
  };
};
