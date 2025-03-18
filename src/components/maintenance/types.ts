
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
}
