
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "../types";

export interface AppointmentData {
  vendorId: string;
  date: Date;
  time: string;
  title: string;
  notes?: string;
  sendEmail: boolean;
  setReminder: boolean;
  reminderTime: string;
}

export const useAppointmentActions = (
  appointments: Appointment[],
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>,
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  appointmentToEdit: Appointment | null,
  setAppointmentToEdit: React.Dispatch<React.SetStateAction<Appointment | null>>,
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
  t: (key: string, fallback?: Record<string, string>) => string
) => {
  const { toast } = useToast();
  
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

  const handleNewOrUpdateAppointment = (appointmentData: AppointmentData) => {
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
    handleAddAppointment,
    handleEditAppointment,
    handleStatusChange,
    handleNewOrUpdateAppointment
  };
};
