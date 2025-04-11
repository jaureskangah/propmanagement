
export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  property?: string;
  unit?: string;
  status: string;
  vendor: string;
  cost: number;
  date?: string;
  priority: string;
  photos?: string[];
}
