
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
  property_id?: string;
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
  property_id?: string;
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  weekdays?: string[];
}

// Add the MaintenanceRequest interface
export interface MaintenanceRequest {
  id: string;
  issue: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
  property_id?: string;
  tenant_feedback?: string;
  tenant_rating?: number;
  tenant_notified?: boolean;
  photos?: string[];
  tenants?: {
    id: string;
    name: string;
    unit_number: string;
    properties?: {
      name: string;
    };
  };
}
