
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, isToday } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { useLocale } from "@/components/providers/LocaleProvider";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { AppointmentItem } from "./AppointmentItem";

interface CalendarTabProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  filteredAppointments: Appointment[];
  getVendorById: (id: string) => Vendor | null;
  handleEditAppointment: (appointment: Appointment) => void;
  handleStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}

export const CalendarTab = ({
  selectedDate,
  setSelectedDate,
  filteredAppointments,
  getVendorById,
  handleEditAppointment,
  handleStatusChange
}: CalendarTabProps) => {
  const { t, locale } = useLocale();
  
  const appointmentsForSelectedDate = selectedDate 
    ? filteredAppointments.filter(appt => isSameDay(appt.date, selectedDate))
    : [];
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-sm">{t('calendar')}</CardTitle>
          <CardDescription>{t('selectDateToViewAppointments')}</CardDescription>
        </CardHeader>
        <CardContent className="max-w-full overflow-hidden">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border max-w-full"
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
                  <AppointmentItem
                    key={appointment.id}
                    appointment={appointment}
                    vendor={vendor}
                    onEdit={handleEditAppointment}
                    onStatusChange={handleStatusChange}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
