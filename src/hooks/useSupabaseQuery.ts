
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSupabaseError } from "./useSupabaseError";
import { useToast } from "@/components/ui/use-toast";

export function useSupabaseQuery<T>(
  key: string[],
  table: string,
  options: {
    select?: string;
    match?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}
) {
  const { handleError } = useSupabaseError();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      let query = supabase.from(table).select(options.select || '*');

      if (options.match) {
        Object.entries(options.match).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        handleError(error);
        throw error;
      }

      return data as T[];
    },
  });
}

export function useSupabaseMutation<T>(
  table: string,
  options: {
    onSuccess?: (data: T) => void;
    successMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  const { handleError } = useSupabaseError();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variables: Partial<T>) => {
      const { data, error } = await supabase
        .from(table)
        .insert(variables)
        .select()
        .single();

      if (error) {
        handleError(error);
        throw error;
      }

      return data as T;
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

      // Invalider le cache pour recharger les données
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });
}

export function useSupabaseUpdate<T>(
  table: string,
  options: {
    onSuccess?: (data: T) => void;
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
      data: Partial<T>;
    }) => {
      const { data: updatedData, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        handleError(error);
        throw error;
      }

      return updatedData as T;
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

export function useSupabaseDelete(
  table: string,
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
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
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
