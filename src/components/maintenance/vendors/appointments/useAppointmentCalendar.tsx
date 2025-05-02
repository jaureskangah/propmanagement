
import { useState } from "react";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAppointmentReminders } from "./hooks/useAppointmentReminders";
import { useAppointmentFilters } from "./hooks/useAppointmentFilters";
import { useAppointmentActions, AppointmentData } from "./hooks/useAppointmentActions";

export const useAppointmentCalendar = (vendors: Vendor[]) => {
  const { t, locale } = useLocale();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      vendorId: vendors[0]?.id || '',
      date: new Date(2025, 4, 15), // Using current year for demo
      time: '10:00',
      title: 'Réparation plomberie',
      status: 'scheduled'
    },
    {
      id: '2',
      vendorId: vendors[1]?.id || '',
      date: new Date(2025, 4, 18), // Using current year for demo
      time: '14:30',
      title: 'Inspection chauffage',
      status: 'completed'
    },
    {
      id: '3',
      vendorId: vendors[0]?.id || '',
      date: new Date(),
      time: '16:00',
      title: "Réparation d'urgence",
      status: 'scheduled',
      notes: 'Intervention urgente suite à un dégât des eaux'
    }
  ]);
  
  const getVendorById = (id: string) => {
    return vendors.find(vendor => vendor.id === id) || null;
  };
  
  // Use the appointment reminders hook
  useAppointmentReminders(appointments, t, locale, getVendorById, setAppointments);
  
  // Use the appointment filters hook
  const {
    filteredAppointments,
    appointmentsForSelectedDate,
    upcomingAppointments,
    todayAppointments
  } = useAppointmentFilters(appointments, searchQuery, selectedDate, getVendorById);
  
  // Use the appointment actions hook
  const {
    handleAddAppointment,
    handleEditAppointment,
    handleStatusChange,
    handleNewOrUpdateAppointment
  } = useAppointmentActions(
    appointments, 
    setAppointments, 
    setDialogOpen, 
    appointmentToEdit, 
    setAppointmentToEdit, 
    setSelectedDate, 
    t
  );
  
  return {
    selectedDate,
    setSelectedDate,
    dialogOpen,
    setDialogOpen,
    searchQuery,
    setSearchQuery,
    appointmentToEdit,
    setAppointmentToEdit,
    appointments,
    filteredAppointments,
    appointmentsForSelectedDate,
    upcomingAppointments,
    todayAppointments,
    getVendorById,
    handleAddAppointment,
    handleEditAppointment,
    handleStatusChange,
    handleNewOrUpdateAppointment
  };
};
