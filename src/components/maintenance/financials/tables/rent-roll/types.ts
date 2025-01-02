export interface RentRollData {
  name: string;
  rent_amount: number;
  lease_end: string;
  lastPayment: {
    amount: number;
    date: string;
    status: string;
  } | null;
}

export interface TenantWithPayments {
  name: string;
  rent_amount: number;
  lease_end: string;
  tenant_payments: Array<{
    amount: number;
    status: string;
    payment_date: string;
  }>;
}