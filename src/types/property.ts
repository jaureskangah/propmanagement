export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  type: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  name: string;
  address: string;
  units: number;
  type: string;
  image?: string;
}