export interface Task {
  id: string;
  title: string;
  type: "regular" | "inspection" | "seasonal";
  priority: "low" | "medium" | "high" | "urgent";
  date: Date;
  completed: boolean;
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  user_id: string;
  has_reminder?: boolean;
  reminder_date?: Date;
  reminder_method?: "app" | "email" | "both";
}

export interface NewTask {
  title: string;
  type: "regular" | "inspection" | "seasonal";
  priority: "low" | "medium" | "high" | "urgent";
  date: Date;
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  has_reminder?: boolean;
  reminder_date?: Date;
  reminder_method?: "app" | "email" | "both";
  property_id?: string; // Ajout du property_id
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  weekdays?: string[];
}
