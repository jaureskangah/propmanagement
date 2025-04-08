
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
  document_type: string; // Added this field
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
  payment_date: string; // Added this field
  status: string;
  type: string;
  description?: string; // Added this field
  notes?: string;
  reference_number?: string;
}

// Renamed from Payment to avoid conflicts
export type Payment = TenantPayment;

export interface MaintenanceRequest {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  issue: string; // Added this field
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  tenant_notified?: boolean; // Added this field
  tenant_feedback?: string; // Added this field
  tenant_rating?: number; // Added this field
  deadline?: string; // Added this field
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
  content?: string; // Added this field
  sender_id: string;
  sender_type: 'tenant' | 'owner' | 'system';
  read_status: boolean;
  status: string; // Added this field
  category: string; // Added this field
  type: string; // Added this field
  is_from_tenant?: boolean; // Added this field
  parent_id?: string; // Added this field
  created_at: string;
  updated_at: string;
  attachments?: string[];
  important?: boolean;
}
