
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Task } from "../../types";

export const useTasksQuery = (propertyId: string | undefined = undefined) => {
  return useQuery({
    queryKey: ['tasks', propertyId],
    queryFn: async () => {
      let query = supabase
        .from('maintenance_tasks')
        .select('*');
      
      // Si on a une propriété spécifique, on filtre par cette propriété
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('date');
      
      if (error) {
        throw new Error(error.message);
      }
      
      // On trie les tâches en mettant les non-complétées en premier
      const sortedTasks = data.sort((a, b) => {
        // D'abord on trie par statut "complété"
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        
        // Ensuite on trie par date
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
};
