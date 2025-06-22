
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface UseSupabaseDeleteOptions {
  onSuccess?: () => void;
  successMessage?: string;
  queryKeysToInvalidate?: string[][];
}

export function useSupabaseDelete(
  tableName: string,
  options: UseSupabaseDeleteOptions = {}
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      if (options.successMessage) {
        toast({
          title: "Succès",
          description: options.successMessage,
        });
      }

      if (options.onSuccess) {
        options.onSuccess();
      }

      // Invalidate specified query keys or default ones
      if (options.queryKeysToInvalidate) {
        options.queryKeysToInvalidate.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      } else {
        // Default invalidation for the table
        queryClient.invalidateQueries({ queryKey: [tableName] });
      }
    },
    onError: (error: any) => {
      console.error(`Delete error for ${tableName}:`, error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
