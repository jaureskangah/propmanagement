export interface Vendor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  emergency_contact: boolean;
  rating: number;
  photos?: string[];
}