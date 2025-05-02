
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { addDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "../types";
import { Vendor } from "@/types/vendor";
import { addHours } from "../utils";

export const useAppointmentReminders = (
  appointments: Appointment[],
  t: (key: string, fallback?: Record<string, string>) => string,
  locale: string,
  getVendorById: (id: string) => Vendor | null,
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const { toast } = useToast();

  // Check for upcoming appointments that need reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      appointments.forEach(appointment => {
        if (appointment.setReminder && !appointment.reminderSent && appointment.status === 'scheduled') {
          // Calculate when the reminder should be sent
          const appointmentDate = new Date(appointment.date);
          const [hours, minutes] = appointment.time.split(':').map(Number);
          appointmentDate.setHours(hours, minutes);
          
          let reminderDate = appointmentDate;
          
          // Calculate reminder time based on settings
          switch (appointment.reminderTime) {
            case '1hour':
              reminderDate = addHours(appointmentDate, -1);
              break;
            case '3hours':
              reminderDate = addHours(appointmentDate, -3);
              break;
            case '1day':
              reminderDate = addDays(appointmentDate, -1);
              break;
            case '2days':
              reminderDate = addDays(appointmentDate, -2);
              break;
          }
          
          // If it's time to send the reminder
          if (now >= reminderDate) {
            const vendor = getVendorById(appointment.vendorId);
            if (vendor) {
              toast({
                title: t('reminderNotification'),
                description: `${t('upcomingAppointment')}: ${appointment.title} ${t('with')} ${vendor.name} ${t('on')} ${format(appointmentDate, 'PPP', { locale: locale === 'fr' ? fr : enUS })} ${t('at')} ${appointment.time}`,
                duration: 10000,
              });
              
              // Mark reminder as sent
              setAppointments(prev => 
                prev.map(app => 
                  app.id === appointment.id 
                    ? { ...app, reminderSent: true } 
                    : app
                )
              );
            }
          }
        }
      });
    };
    
    // Check initially and then every minute
    checkReminders();
    const interval = setInterval(checkReminders, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [appointments, t, locale, toast, getVendorById, setAppointments]);
};
