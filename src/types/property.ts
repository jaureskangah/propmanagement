import { ProvinceCode } from './canadianData';

export interface Property {
  id: string;
  name: string;
  address: string;
  city?: string;
  province?: ProvinceCode;
  postal_code?: string;
  units: number;
  type: string;
  rent_amount: number;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  province: ProvinceCode;
  postal_code: string;
  units: number;
  type: string;
  rent_amount: number;
  image?: string;
}