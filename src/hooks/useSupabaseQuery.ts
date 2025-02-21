
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSupabaseError } from "./useSupabaseError";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

// Définir le type des tables disponibles
type TableName = keyof Database['public']['Tables'];
type TablesRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

export function useSupabaseQuery<T extends TableName>(
  key: string[],
  table: T,
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

      return data as TablesRow<T>[];
    },
  });
}

export function useSupabaseMutation<T extends TableName>(
  table: T,
  options: {
    onSuccess?: (data: TablesRow<T>) => void;
    successMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  const { handleError } = useSupabaseError();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variables: Partial<TablesRow<T>>) => {
      const { data, error } = await supabase
        .from(table)
        .insert(variables)
        .select()
        .single();

      if (error) {
        handleError(error);
        throw error;
      }

      return data as TablesRow<T>;
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

export function useSupabaseUpdate<T extends TableName>(
  table: T,
  options: {
    onSuccess?: (data: TablesRow<T>) => void;
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
      data: Partial<TablesRow<T>>;
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

      return updatedData as TablesRow<T>;
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
