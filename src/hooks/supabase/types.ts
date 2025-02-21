
import { Database } from "@/integrations/supabase/types";

export type Tables = Database['public']['Tables']
export type TableName = keyof Tables

export type Row<T extends TableName> = Tables[T]['Row']
export type Insert<T extends TableName> = Tables[T]['Insert']
export type Update<T extends TableName> = Tables[T]['Update']

export interface QueryOptions {
  select?: string;
  match?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
}
