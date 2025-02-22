
import { Database } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";

export type Tables = Database['public']['Tables']
export type TableName = keyof Tables

export type Row<T extends TableName> = Tables[T]['Row']
export type Insert<T extends TableName> = Tables[T]['Insert']
export type Update<T extends TableName> = Tables[T]['Update']

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = Exclude<DbResult<T>, { error: PostgrestError }>

export interface QueryOptions {
  select?: string;
  match?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
}
