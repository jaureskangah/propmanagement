
import { Vendor } from "@/types/vendor";

export interface Appointment {
  id: string;
  vendorId: string;
  date: Date;
  time: string;
  title: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  sendEmail?: boolean;
  setReminder?: boolean;
  reminderTime?: string;
  reminderSent?: boolean;
}

export interface VendorAppointmentCalendarProps {
  vendors: Vendor[];
}

export interface AppointmentItemProps {
  appointment: Appointment;
  vendor: Vendor | null;
  onEdit: (appointment: Appointment) => void;
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}

export interface TodayAppointmentItemProps {
  appointment: Appointment;
  vendor: Vendor | null;
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}

export interface UpcomingAppointmentItemProps {
  appointment: Appointment;
  vendor: Vendor | null;
  onEdit: (appointment: Appointment) => void;
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}
