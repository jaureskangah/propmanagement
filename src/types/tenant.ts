export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  unitNumber: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  documents: TenantDocument[];
  paymentHistory: TenantPayment[];
  maintenanceRequests: MaintenanceRequest[];
  communications: Communication[];
}

export interface TenantDocument {
  id: string;
  name: string;
  date: string;
}

export interface TenantPayment {
  id: string;
  date: string;
  amount: number;
  status: string;
}

export interface MaintenanceRequest {
  id: string;
  date: string;
  issue: string;
  status: string;
}

export interface Communication {
  id: string;
  date: string;
  type: string;
  subject: string;
}