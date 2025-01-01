export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  property?: string;
  unit?: string;
  status: string;
  vendor_id: string;
  vendor?: string;
  cost: number;
  date: string;
  photos?: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}