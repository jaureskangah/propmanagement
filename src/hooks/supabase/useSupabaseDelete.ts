
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSupabaseError } from "../useSupabaseError";
import { useToast } from "@/components/ui/use-toast";
import { TableName } from "./types";

export function useSupabaseDelete<T extends TableName>(
  table: T,
  options: {
    onSuccess?: () => void;
    successMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  const { handleError } = useSupabaseError();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        handleError(error);
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

      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });
}
