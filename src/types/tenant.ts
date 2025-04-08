
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
}
