
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
  // Adding missing properties referenced in useTaskAddition.ts
  description?: string;
  deadline?: Date;
  tenant_id?: string;
  property_id?: string;
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

// Adding MaintenanceRequest interface that was missing
export interface MaintenanceRequest {
  id: string;
  issue: string;
  status: string;
  description?: string;
  priority: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
  tenant_notified?: boolean;
  tenant_feedback?: string;
  tenant_rating?: number;
  deadline?: string;
  photos?: string[];
  status_history?: {
    status: string;
    date: string;
    comments?: string;
  }[];
  tenants?: {
    id: string;
    name: string;
    unit_number: string;
    properties?: {
      name: string;
    }
  };
}
