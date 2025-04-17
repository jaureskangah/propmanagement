
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSupabaseError } from "../useSupabaseError";
import { useToast } from "@/components/ui/use-toast";
import { Row, TableName, Update } from "./types";

export function useSupabaseUpdate<T extends TableName>(
  table: T,
  options: {
    onSuccess?: (data: Row<T>) => void;
    successMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  const { handleError } = useSupabaseError();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Update<T>;
    }) => {
      try {
        console.log(`Updating ${table} with ID ${id}:`, data);
        
        const { data: returnedData, error } = await supabase
          .from(table)
          .update(data as any)
          .match({ id } as any)
          .select()
          .single();

        if (error) {
          console.error(`Error updating ${table}:`, error);
          throw error;
        }
        
        console.log(`Successfully updated ${table}:`, returnedData);
        return returnedData as unknown as Row<T>;
      } catch (error) {
        console.error(`Error in useSupabaseUpdate for ${table}:`, error);
        handleError(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (options.successMessage) {
        toast({
          title: "Succès",
          description: options.successMessage,
        });
      }

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      // Invalider les requêtes pour forcer un rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: [table] });
    },
    onError: (error) => {
      console.error(`Mutation error in useSupabaseUpdate for ${table}:`, error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    }
  });
}
