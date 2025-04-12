
import { Locale } from "date-fns";

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  weekdays: string[];
  end_date?: Date;
}

export interface Task {
  id: string;
  title: string;
  date: Date | string;
  type: "regular" | "inspection" | "seasonal";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed";
  completed: boolean;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  photos?: string[];
  position: number;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  has_reminder: boolean;
  reminder_date?: Date;
  reminder_method?: "app" | "email" | "both";
  tenant_id?: string;
  property_id?: string;
}

export interface NewTask {
  title: string;
  date: Date | string;
  type: "regular" | "inspection" | "seasonal";
  priority: "low" | "medium" | "high" | "urgent";
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  has_reminder?: boolean;
  reminder_date?: Date;
  reminder_method?: "app" | "email" | "both";
  tenant_id?: string;
  property_id?: string;
}

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  issue: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at?: string;
  photos?: string[];
  tenant_feedback?: string;
  tenant_rating?: number;
  tenant_notified?: boolean;
  landlord_notes?: string;
  location?: string;
  due_date?: string;
  assigned_to?: string;
  tenants?: {
    id: string;
    name: string;
    unit_number?: string;
    properties?: {
      name: string;
    };
  };
}
