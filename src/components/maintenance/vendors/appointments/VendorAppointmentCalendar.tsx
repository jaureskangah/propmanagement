
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, Mail, Bell } from "lucide-react";
import { format, addDays, addHours } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { VendorAppointmentDialog } from "./VendorAppointmentDialog";
import { Vendor } from "@/types/vendor";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
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

interface VendorAppointmentCalendarProps {
  vendors: Vendor[];
}

export const VendorAppointmentCalendar = ({ vendors }: VendorAppointmentCalendarProps) => {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      vendorId: vendors[0]?.id || '',
      date: new Date(2023, 9, 15),
      time: '10:00',
      title: 'Réparation plomberie',
      status: 'scheduled'
    },
    {
      id: '2',
      vendorId: vendors[1]?.id || '',
      date: new Date(2023, 9, 18),
      time: '14:30',
      title: 'Inspection chauffage',
      status: 'completed'
    }
  ]);
  
  // Check for upcoming appointments that need reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      appointments.forEach(appointment => {
        if (appointment.setReminder && !appointment.reminderSent) {
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
  }, [appointments, locale, t]);
  
  // Filter appointments for the selected date
  const appointmentsForSelectedDate = selectedDate 
    ? appointments.filter(appt => 
        appt.date.getDate() === selectedDate.getDate() &&
        appt.date.getMonth() === selectedDate.getMonth() &&
        appt.date.getFullYear() === selectedDate.getFullYear()
      )
    : [];
  
  const handleAddAppointment = () => {
    setDialogOpen(true);
  };
  
  const getVendorById = (id: string) => {
    return vendors.find(vendor => vendor.id === id) || null;
  };

  const handleNewAppointment = (appointmentData: {
    vendorId: string;
    date: Date;
    time: string;
    title: string;
    notes?: string;
    sendEmail: boolean;
    setReminder: boolean;
    reminderTime: string;
  }) => {
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
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('vendorAppointments')}</h3>
        <Button size="sm" onClick={handleAddAppointment}>
          {t('scheduleAppointment')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">{t('calendar')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={locale === 'fr' ? fr : enUS}
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">
              {selectedDate ? (
                format(selectedDate, 'PPP', { locale: locale === 'fr' ? fr : enUS })
              ) : (
                t('noDateSelected')
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsForSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('noAppointmentsScheduled')}
              </div>
            ) : (
              <div className="space-y-3">
                {appointmentsForSelectedDate.map(appointment => {
                  const vendor = getVendorById(appointment.vendorId);
                  return (
                    <div 
                      key={appointment.id}
                      className="flex items-start p-3 border rounded-md"
                    >
                      <div className="mr-3 mt-1">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{appointment.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                        {vendor && (
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <User className="h-3.5 w-3.5 mr-1" />
                            <span>{vendor.name} ({vendor.specialty})</span>
                          </div>
                        )}
                        {appointment.sendEmail && (
                          <div className="flex items-center text-sm text-green-600 mt-1">
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            <span>{t('emailNotificationSent')}</span>
                          </div>
                        )}
                        {appointment.setReminder && (
                          <div className="flex items-center text-sm text-amber-600 mt-1">
                            <Bell className="h-3.5 w-3.5 mr-1" />
                            <span>{appointment.reminderSent ? t('reminderSent') : t('reminderScheduled')}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status === 'completed' 
                            ? t('completed')
                            : appointment.status === 'cancelled'
                            ? t('cancelled')
                            : t('scheduled')
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <VendorAppointmentDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendors={vendors}
        onSuccess={handleNewAppointment}
      />
    </div>
  );
};
