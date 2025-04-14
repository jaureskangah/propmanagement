
export interface Vendor {
  id: string;
  created_at?: string;
  name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
}

export interface Property {
  id: string;
  created_at?: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
}

export interface Task {
  id: string;
  created_at?: string;
  title: string;
  type: string;
  priority: string;
  date: string;
  property_id: string;
  completed: boolean;
  notes?: string;
  is_recurring?: boolean;
  recurrence_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurrence_interval?: number;
  recurrence_pattern?: string;
  has_reminder?: boolean;
  reminder_date?: string | Date;
  reminder_method?: "app" | "email" | "both";
  photos?: string[];
  tenants?: Array<{id: string, name: string}>;
}

export interface MaintenanceRequest {
  id: string;
  title?: string;
  issue: string;
  description?: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at?: string;
  tenant_id?: string;
  property_id?: string;
  assigned_to?: string;
  due_date?: string;
  tenant_notified?: boolean;
  tenant_feedback?: string;
  tenant_rating?: number;
  photos?: string[];
  tenants?: Array<{id: string, name: string}>;
}

export interface NewTask {
  title: string;
  type: "regular" | "inspection" | "seasonal";
  priority: "low" | "medium" | "high" | "urgent";
  date: Date;
  property_id: string;
  is_recurring?: boolean;
  recurrence_frequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurrence_interval?: number;
  recurrence_pattern?: string;
  has_reminder?: boolean;
  reminder_date?: Date;
  reminder_method?: "app" | "email" | "both";
  completed?: boolean;
}

export interface RecurrencePattern {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
}
