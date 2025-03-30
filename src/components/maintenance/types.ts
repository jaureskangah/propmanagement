
export interface Tenant {
  id: string;
  name: string;
  unit_number: string;
  email: string;
  phone?: string;
  property_id?: string;
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly";
  interval: number;
  weekdays?: string[];
  end_date?: Date;
}

export interface NewTask {
  title: string;
  date: Date;
  type: "regular" | "inspection" | "seasonal";
  priority: "low" | "medium" | "high" | "urgent";
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  has_reminder?: boolean;
  reminder_date?: Date;
  reminder_method?: "app" | "email" | "both";
}

export interface Task extends NewTask {
  id: string;
  user_id: string;
  completed: boolean;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
  photos: string[];
  position: number;
}
