
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSupabaseError } from "./useSupabaseError";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";

type Tables = Database['public']['Tables']
type TableName = keyof Tables

type Row<T extends TableName> = Tables[T]['Row']
type Insert<T extends TableName> = Tables[T]['Insert']
type Update<T extends TableName> = Tables[T]['Update']

interface QueryOptions {
  select?: string;
  match?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useSupabaseQuery<T extends TableName>(
  key: string[],
  table: T,
  options: QueryOptions = {}
) {
  const { handleError } = useSupabaseError();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
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

        if (error) throw error;

        return data as Row<T>[];
      } catch (error) {
        handleError(error as PostgrestError);
        throw error;
      }
    },
  });
}

export function useSupabaseMutation<T extends TableName>(
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
    mutationFn: async (variables: Insert<T>) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .insert(variables)
          .select()
          .single();

        if (error) throw error;
        return data as Row<T>;
      } catch (error) {
        handleError(error as PostgrestError);
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
          .eq('id', id as keyof Row<T>)
          .select()
          .single();

        if (error) throw error;
        return updatedData as Row<T>;
      } catch (error) {
        handleError(error as PostgrestError);
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
          .eq('id', id as keyof Row<T>);

        if (error) throw error;
      } catch (error) {
        handleError(error as PostgrestError);
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
