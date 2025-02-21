
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSupabaseError } from "./useSupabaseError";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type Tables = Database['public']['Tables']
type TableName = keyof Tables

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

      return data as Tables[T]['Row'][];
    },
  });
}

export function useSupabaseMutation<T extends TableName>(
  table: T,
  options: {
    onSuccess?: (data: Tables[T]['Row']) => void;
    successMessage?: string;
  } = {}
) {
  const queryClient = useQueryClient();
  const { handleError } = useSupabaseError();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variables: Tables[T]['Insert']) => {
      const { data, error } = await supabase
        .from(table)
        .insert(variables)
        .select()
        .single();

      if (error) {
        handleError(error);
        throw error;
      }

      return data as Tables[T]['Row'];
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
    onSuccess?: (data: Tables[T]['Row']) => void;
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
      data: Tables[T]['Update'];
    }): Promise<Tables[T]['Row']> => {
      const result = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (result.error) {
        handleError(result.error);
        throw result.error;
      }

      return result.data as Tables[T]['Row'];
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
