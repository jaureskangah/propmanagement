
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_updates: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}
