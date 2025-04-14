
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";

export const useTasksQuery = (propertyId: string | undefined = undefined) => {
  const result = useQuery({
    queryKey: ['tasks', propertyId],
    queryFn: async () => {
      try {
        console.log("Fetching tasks for property:", propertyId);
        
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
        
        console.log(`Fetched ${data?.length || 0} tasks`);
        
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
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
    },
    // Performance optimizations
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (replaced cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window is focused
    refetchInterval: false, // Disable automatic periodic refetching
  });

  // Return structured data with additional helper methods
  return {
    tasks: result.data || [],
    isLoading: result.isLoading,
    error: result.error,
    refreshTasks: () => result.refetch()
  };
};
