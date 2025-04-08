
export interface Tenant {
  id: string;
  name: string;
  email: string | null;
  property_id: string;
  properties: {
    name: string;
  };
  unit_number: string | null;
  phone: string | null;
  lease_start: string | null; // ISO date string
  lease_end: string | null; // ISO date string
  rent_amount: number | null;
  security_deposit: number | null;
  payment_due_day: number | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  notes: string | null;
  tenant_profile_id: string | null;
  // Add missing relations that were causing TypeScript errors
  documents?: TenantDocument[];
  paymentHistory?: TenantPayment[];
  maintenanceRequests?: MaintenanceRequest[];
  communications?: Communication[];
}

export interface TenantDocument {
  id: string;
  tenant_id: string;
  name: string;
  type: string;
  category: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  size?: number;
  status?: string;
}

export interface TenantPayment {
  id: string;
  tenant_id: string;
  amount: number;
  date: string;
  status: string;
  type: string;
  notes?: string;
  reference_number?: string;
}

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  photos?: string[];
  scheduled_date?: string;
  completed_date?: string;
  assigned_to?: string;
}

export interface Communication {
  id: string;
  tenant_id: string;
  subject: string;
  message: string;
  sender_id: string;
  sender_type: 'tenant' | 'owner' | 'system';
  read_status: boolean;
  created_at: string;
  updated_at: string;
  attachments?: string[];
  important?: boolean;
}
