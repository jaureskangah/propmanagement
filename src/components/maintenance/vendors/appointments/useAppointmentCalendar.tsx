
import { useState, useEffect } from "react";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { isToday, isAfter, isBefore, addDays, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useAppointmentCalendar = (vendors: Vendor[]) => {
  const { toast } = useToast();
  const { t } = useLocale();
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
  }, [appointments, t]);
  
  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appointment => {
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
  
  // Filter appointments for the selected date
  const appointmentsForSelectedDate = selectedDate 
    ? filteredAppointments.filter(appt => isSameDay(appt.date, selectedDate))
    : [];
    
  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = filteredAppointments.filter(appt => 
    appt.status === 'scheduled' && 
    isAfter(appt.date, new Date()) && 
    isBefore(appt.date, addDays(new Date(), 7))
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get today's appointments
  const todayAppointments = filteredAppointments.filter(appt => 
    appt.status === 'scheduled' && 
    isToday(appt.date)
  ).sort((a, b) => a.time.localeCompare(b.time));
  
  const handleAddAppointment = () => {
    setAppointmentToEdit(null);
    setDialogOpen(true);
  };
  
  const handleEditAppointment = (appointment: Appointment) => {
    setAppointmentToEdit(appointment);
    setDialogOpen(true);
  };
  
  const handleStatusChange = (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId ? { ...app, status: newStatus } : app
    ));
    
    const statusMessage = newStatus === 'completed' 
      ? t('appointmentCompleted') 
      : newStatus === 'cancelled' 
      ? t('appointmentCancelled')
      : t('appointmentRescheduled');
      
    toast({
      title: t('statusUpdated'),
      description: statusMessage,
      variant: newStatus === 'cancelled' ? 'destructive' : 'default'
    });
  };

  const handleNewOrUpdateAppointment = (appointmentData: {
    vendorId: string;
    date: Date;
    time: string;
    title: string;
    notes?: string;
    sendEmail: boolean;
    setReminder: boolean;
    reminderTime: string;
  }) => {
    if (appointmentToEdit) {
      // Update existing appointment
      setAppointments(prev => prev.map(app => 
        app.id === appointmentToEdit.id 
          ? { 
              ...app, 
              ...appointmentData,
              reminderSent: appointmentData.reminderTime !== appointmentToEdit.reminderTime 
                ? false 
                : app.reminderSent
            } 
          : app
      ));
      
      toast({
        title: t('success'),
        description: t('appointmentUpdated')
      });
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Math.random().toString(36).substring(2, 11),
        vendorId: appointmentData.vendorId,
        date: appointmentData.date,
        time: appointmentData.time,
        title: appointmentData.title,
        status: 'scheduled',
        notes: appointmentData.notes,
        sendEmail: appointmentData.sendEmail,
        setReminder: appointmentData.setReminder,
        reminderTime: appointmentData.reminderTime,
        reminderSent: false
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      setSelectedDate(appointmentData.date);
      
      toast({
        title: t('success'),
        description: t('appointmentScheduled')
      });
    }
  };
  
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
