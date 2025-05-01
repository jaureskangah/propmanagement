import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, Mail, Bell, Phone, Check, X, AlertTriangle } from "lucide-react";
import { format, addDays, addHours, isSameDay, isToday, isAfter, isBefore, parseISO } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { VendorAppointmentDialog } from "./VendorAppointmentDialog";
import { Vendor } from "@/types/vendor";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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
  
  // Define the getVendorById function BEFORE it's used
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
  }, [appointments, locale, t]);
  
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
    ? filteredAppointments.filter(appt => 
        isSameDay(appt.date, selectedDate)
      )
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xl font-medium">{t('vendorAppointments')}</h3>
          <p className="text-sm text-muted-foreground">{t('manageVendorAppointments')}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            placeholder={t('searchAppointments')} 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button size="sm" onClick={handleAddAppointment}>
            {t('scheduleAppointment')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="calendar">{t('calendar')}</TabsTrigger>
          <TabsTrigger value="today">{t('today')}</TabsTrigger>
          <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1 border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-sm">{t('calendar')}</CardTitle>
                <CardDescription>{t('selectDateToViewAppointments')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                  locale={locale === 'fr' ? fr : enUS}
                  modifiers={{
                    withAppointments: filteredAppointments
                      .filter(apt => apt.status === 'scheduled')
                      .map(apt => apt.date)
                  }}
                  modifiersStyles={{
                    withAppointments: {
                      backgroundColor: '#e11d48',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm">
                    {selectedDate ? (
                      format(selectedDate, 'PPP', { locale: locale === 'fr' ? fr : enUS })
                    ) : (
                      t('noDateSelected')
                    )}
                  </CardTitle>
                  {selectedDate && isToday(selectedDate) && (
                    <Badge className="bg-blue-500">{t('today')}</Badge>
                  )}
                </div>
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
                        <Card
                          key={appointment.id}
                          className={`
                            border-l-4 hover:shadow-md transition-all 
                            ${appointment.status === 'completed' ? 'border-l-green-500' : 
                              appointment.status === 'cancelled' ? 'border-l-gray-500' : 
                              'border-l-amber-500'}
                          `}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{appointment.title}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    appointment.status === 'completed' 
                                      ? 'bg-green-100 text-green-800'
                                      : appointment.status === 'cancelled'
                                      ? 'bg-gray-100 text-gray-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {appointment.status === 'completed' 
                                      ? t('completed')
                                      : appointment.status === 'cancelled'
                                      ? t('cancelled')
                                      : t('scheduled')
                                    }
                                  </span>
                                </div>
                                
                                <div className="mt-2 space-y-1 text-sm">
                                  <div className="flex items-center text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    <span>{appointment.time}</span>
                                  </div>
                                  
                                  {vendor && (
                                    <div className="flex items-center text-muted-foreground">
                                      <User className="h-3.5 w-3.5 mr-1" />
                                      <span>{vendor.name} ({vendor.specialty})</span>
                                    </div>
                                  )}
                                  
                                  {vendor && (
                                    <div className="flex items-center text-muted-foreground">
                                      <Phone className="h-3.5 w-3.5 mr-1" />
                                      <span>{vendor.phone}</span>
                                    </div>
                                  )}
                                  
                                  {appointment.notes && (
                                    <div className="text-muted-foreground mt-1 italic border-l-2 border-muted pl-2">
                                      {appointment.notes}
                                    </div>
                                  )}
                                  
                                  {appointment.sendEmail && (
                                    <div className="flex items-center text-green-600">
                                      <Mail className="h-3.5 w-3.5 mr-1" />
                                      <span>{t('emailNotificationSent')}</span>
                                    </div>
                                  )}
                                  
                                  {appointment.setReminder && (
                                    <div className="flex items-center text-amber-600">
                                      <Bell className="h-3.5 w-3.5 mr-1" />
                                      <span>{appointment.reminderSent ? t('reminderSent') : t('reminderScheduled')}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {appointment.status === 'scheduled' && (
                                <div className="flex flex-col gap-1 ml-2">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7" 
                                    onClick={() => handleEditAppointment(appointment)}
                                    title={t('edit')}
                                  >
                                    <CalendarIcon className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleStatusChange(appointment.id, 'completed')}
                                    title={t('markAsCompleted')}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                    title={t('cancel')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="today">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {t('todayAppointments')}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({format(new Date(), 'PPP', { locale: locale === 'fr' ? fr : enUS })})
                  </span>
                </CardTitle>
                <Badge className="bg-blue-500">{todayAppointments.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <CalendarIcon className="h-8 w-8 mb-2 text-muted-foreground/60" />
                  {t('noAppointmentsToday')}
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map(appointment => {
                    const vendor = getVendorById(appointment.vendorId);
                    const now = new Date();
                    const [hours, minutes] = appointment.time.split(':').map(Number);
                    const appointmentTime = new Date();
                    appointmentTime.setHours(hours, minutes);
                    const isUpcoming = appointmentTime > now;
                    
                    return (
                      <Card
                        key={appointment.id}
                        className={`
                          border-l-4 hover:shadow-md transition-all 
                          ${isUpcoming ? 'border-l-amber-500' : 'border-l-red-500'}
                        `}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{appointment.title}</h4>
                                {isUpcoming ? (
                                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                    {t('upcoming')}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {t('now')}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="mt-2 space-y-1 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>{appointment.time}</span>
                                </div>
                                
                                {vendor && (
                                  <div className="flex items-center text-muted-foreground">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    <span>{vendor.name} ({vendor.specialty})</span>
                                  </div>
                                )}
                                
                                {vendor && (
                                  <div className="flex items-center text-muted-foreground">
                                    <Phone className="h-3.5 w-3.5 mr-1" />
                                    <span>{vendor.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 ml-2">
                              <Button 
                                size="sm"
                                variant="default"
                                className="h-8" 
                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                {t('complete')}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {t('upcomingAppointments')}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({t('next7Days')})
                  </span>
                </CardTitle>
                <Badge className="bg-blue-500">{upcomingAppointments.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <CalendarIcon className="h-8 w-8 mb-2 text-muted-foreground/60" />
                  {t('noUpcomingAppointments')}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map(appointment => {
                    const vendor = getVendorById(appointment.vendorId);
                    return (
                      <Card
                        key={appointment.id}
                        className="border-l-4 border-l-amber-500 hover:shadow-md transition-all"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{appointment.title}</h4>
                                {isToday(appointment.date) && (
                                  <Badge className="bg-red-500">
                                    {t('today')}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="mt-2 space-y-1 text-sm">
                                <div className="flex items-center font-medium">
                                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>{format(appointment.date, 'PPP', { locale: locale === 'fr' ? fr : enUS })}</span>
                                </div>
                                
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>{appointment.time}</span>
                                </div>
                                
                                {vendor && (
                                  <div className="flex items-center text-muted-foreground">
                                    <User className="h-3.5 w-3.5 mr-1" />
                                    <span>{vendor.name} ({vendor.specialty})</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 ml-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-7 w-7" 
                                onClick={() => handleEditAppointment(appointment)}
                                title={t('edit')}
                              >
                                <CalendarIcon className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                title={t('cancel')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <VendorAppointmentDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendors={vendors}
        appointment={appointmentToEdit}
        onSuccess={handleNewOrUpdateAppointment}
      />
    </div>
  );
};
