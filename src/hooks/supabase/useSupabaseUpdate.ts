
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
        const { data: updatedData, error } = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return updatedData as unknown as Row<T>;
      } catch (error) {
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

      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });
}
