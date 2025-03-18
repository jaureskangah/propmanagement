
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
}

export interface NewTask {
  issue: string;
  description?: string;
  tenant_id?: string;
  property_id?: string;
  priority: string;
  deadline?: string;
  title?: string;
  date?: Date;
  type?: 'regular' | 'inspection' | 'seasonal';
  is_recurring?: boolean;
  recurrence_pattern?: {
    frequency: string;
    interval: number;
    weekdays: string[];
    end_date?: string;
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
}
