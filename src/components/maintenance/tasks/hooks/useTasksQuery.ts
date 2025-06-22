
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";

export const useTasksQuery = (propertyId: string | undefined = undefined) => {
  console.log("useTasksQuery - Property ID:", propertyId);
  
  const result = useQuery({
    queryKey: ['maintenance_tasks', propertyId],
    queryFn: async () => {
      try {
        console.log("useTasksQuery - Fetching tasks for property:", propertyId);
        
        let query = supabase
          .from('maintenance_tasks')
          .select('*');
        
        // Only filter by property if propertyId is provided and not empty
        if (propertyId && propertyId.trim() !== "") {
          query = query.eq('property_id', propertyId);
        }
        
        const { data, error } = await query.order('date');
        
        if (error) {
          console.error("useTasksQuery - Error fetching tasks:", error);
          // Don't throw error, return empty array instead
          return [];
        }
        
        console.log(`useTasksQuery - Fetched ${data?.length || 0} tasks:`, data);
        
        if (!data || data.length === 0) {
          return [];
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
        
        console.log("useTasksQuery - Sorted tasks:", sortedTasks);
        return sortedTasks as Task[];
      } catch (error) {
        console.error("useTasksQuery - Exception fetching tasks:", error);
        // Return empty array instead of throwing
        return [];
      }
    },
    // Performance optimizations
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window is focused
    refetchInterval: false, // Disable automatic periodic refetching
    // Don't retry on error to avoid infinite loops
    retry: false,
  });

  console.log("useTasksQuery result:", {
    data: result.data,
    isLoading: result.isLoading,
    error: result.error,
    dataLength: result.data?.length || 0
  });

  // Return structured data with additional helper methods
  return {
    tasks: result.data || [],
    isLoading: result.isLoading,
    error: result.error,
    refreshTasks: () => result.refetch()
  };
};
