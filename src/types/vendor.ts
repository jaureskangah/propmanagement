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

export interface VendorFormValues {
  name: string;
  specialty: string;
  phone: string;
  email: string;
  emergency_contact: boolean;
  documents?: File[];
  photos?: File[];
  existingPhotos?: string[];
}