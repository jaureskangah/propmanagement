
import { useMemo } from "react";
import { isToday, isAfter, isBefore, isSameDay, addDays } from "date-fns";
import { Appointment } from "../types";
import { Vendor } from "@/types/vendor";

export const useAppointmentFilters = (
  appointments: Appointment[],
  searchQuery: string,
  selectedDate: Date | undefined,
  getVendorById: (id: string) => Vendor | null
) => {
  // Filter appointments based on search query
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const vendor = getVendorById(appointment.vendorId);
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        appointment.title.toLowerCase().includes(searchLower) ||
        vendor?.name.toLowerCase().includes(searchLower) ||
        vendor?.specialty.toLowerCase().includes(searchLower) ||
        (appointment.notes && appointment.notes.toLowerCase().includes(searchLower))
      );
    });
  }, [appointments, searchQuery, getVendorById]);
  
  // Filter appointments for the selected date
  const appointmentsForSelectedDate = useMemo(() => {
    return selectedDate 
      ? filteredAppointments.filter(appt => isSameDay(appt.date, selectedDate))
      : [];
  }, [filteredAppointments, selectedDate]);
    
  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = useMemo(() => {
    return filteredAppointments
      .filter(appt => 
        appt.status === 'scheduled' && 
        isAfter(appt.date, new Date()) && 
        isBefore(appt.date, addDays(new Date(), 7))
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredAppointments]);
  
  // Get today's appointments
  const todayAppointments = useMemo(() => {
    return filteredAppointments
      .filter(appt => 
        appt.status === 'scheduled' && 
        isToday(appt.date)
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [filteredAppointments]);

  return {
    filteredAppointments,
    appointmentsForSelectedDate,
    upcomingAppointments,
    todayAppointments
  };
};
