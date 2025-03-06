export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  property_id: string | null;
  properties?: {
    name: string;
  };
  unit_number: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  tenant_profile_id: string | null;
  documents: TenantDocument[];
  paymentHistory: TenantPayment[];
  maintenanceRequests: MaintenanceRequest[];
  communications: Communication[];
  avatar_url?: string;
}

export interface TenantDocument {
  id: string;
  name: string;
  file_url?: string;
  created_at: string;
  uploaded_at?: string;
  document_type?: 'lease' | 'receipt' | 'other';
  tenant_id?: string;
  category?: string;
  source?: 'tenant' | 'landlord';
  sender_name?: string;
}

export interface TenantPayment {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
  created_at: string;
  description?: string;
  date?: string;
}

export interface MaintenanceRequest {
  id: string;
  issue: string;
  status: string;
  created_at: string;
  tenant_notified?: boolean;
  description?: string;
  priority: string;
  updated_at: string;
  deadline?: string;
  photos?: string[];
  tenant_feedback?: string;
  tenant_rating?: number;
  tenant_id?: string;
  status_history?: {
    status: string;
    date: string;
    comments?: string;
  }[];
}

export interface Communication {
  id: string;
  type: string; // 'message', 'email', 'notification'
  subject: string;
  content?: string;
  created_at: string;
  status: string; // 'read', 'unread'
  category: string; // 'general', 'maintenance', 'urgent', 'payment'
  attachments?: string[];
  parent_id?: string;
  is_from_tenant?: boolean;
  resolved_at?: string;
  tenant_notified?: boolean;
  tenant_id?: string;
}

// Pour la compatibilité avec les composants existants
export type Document = TenantDocument;
export type Payment = TenantPayment;
