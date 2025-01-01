export interface Vendor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  emergency_contact: boolean;
  rating: number;
  photos?: string[];
  user_id: string;
}

export interface VendorReview {
  id: string;
  vendor_id: string;
  comment: string;
  rating: number;
  quality_rating: number;
  price_rating: number;
  punctuality_rating: number;
  created_at: string;
  user_id: string;
}

export interface VendorIntervention {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  date: string;
  cost: number;
  status: string;
  user_id: string;
  photos?: string[];
}