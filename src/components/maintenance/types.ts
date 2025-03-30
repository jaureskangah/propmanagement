
export interface Tenant {
  id: string;
  name: string;
  unit_number: string;
  properties?: {
    name: string;
  };
}

export interface MaintenanceRequest {
  id: string;
  issue: string;
  status: string;
  priority: string;
  created_at: string;
  tenant_id: string;
  tenant_notified: boolean;
  tenants?: Tenant;
  photos?: string[];
  description?: string;
  tenant_feedback?: string;
  tenant_rating?: number;
  deadline?: string;
  updated_at?: string;
  title?: string;
}

export interface NewTask {
  title: string;
  description?: string;
  tenant_id?: string;
  property_id?: string;
  priority: string;
  deadline?: string;
  date: Date;
  type: 'regular' | 'inspection' | 'seasonal';
  is_recurring?: boolean;
  recurrence_pattern?: {
    frequency: string;
    interval: number;
    weekdays: string[];
    end_date?: string;
  };
  reminder?: {
    enabled: boolean;
    time?: string; // Format HH:MM
    date?: Date; // Si différent de la date de tâche
    notification_type: 'email' | 'app' | 'both';
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  due_date: string;
  is_recurring: boolean;
  recurrence_pattern?: {
    frequency: string;
    interval: number;
    weekdays: string[];
    end_date?: string;
  };
  type: 'regular' | 'inspection' | 'seasonal';
  assigned_to?: string;
  property_id?: string;
  tenant_id?: string;
  date: Date;
  completed: boolean;
  user_id: string;
  reminder?: {
    enabled: boolean;
    time?: string; // Format HH:MM
    date?: Date;
    notification_type: 'email' | 'app' | 'both';
    last_sent?: string;
  };
}
