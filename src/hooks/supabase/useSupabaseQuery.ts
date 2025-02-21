
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSupabaseError } from "../useSupabaseError";
import { QueryOptions, Row, TableName } from "./types";

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

        return data as unknown as Row<T>[];
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
  });
}
