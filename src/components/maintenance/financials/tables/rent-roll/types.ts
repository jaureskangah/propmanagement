export interface RentRollData {
  name: string;
  unit: string;
  rent_amount: number;
  lease_end: string;
  lastPayment: {
    amount: number;
    date: string;
    status: string;
  } | null;
}

export interface TenantWithPayments {
  id: string;
  name: string;
  unit_number: string;
  rent_amount: number;
  lease_end: string;
  tenant_payments: Array<{
    amount: number;
    status: string;
    payment_date: string;
  }>;
}