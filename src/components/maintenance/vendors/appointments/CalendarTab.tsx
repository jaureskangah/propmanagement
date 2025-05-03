
import React from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { isSameDay } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { AppointmentCalendar } from "./calendar/AppointmentCalendar";
import { DateHeader } from "./calendar/DateHeader";
import { AppointmentsList } from "./calendar/AppointmentsList";

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
  const { t } = useLocale();
  
  const appointmentsForSelectedDate = selectedDate 
    ? filteredAppointments.filter(appt => isSameDay(appt.date, selectedDate))
    : [];
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <Card className="md:col-span-5 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-sm">{t('calendar')}</CardTitle>
          <CardDescription>{t('selectDateToViewAppointments')}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden p-0 sm:p-2">
          <AppointmentCalendar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            appointments={filteredAppointments}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-7 border-l-4 border-l-blue-500">
        <CardHeader>
          <DateHeader selectedDate={selectedDate} />
        </CardHeader>
        <CardContent>
          <AppointmentsList 
            appointments={appointmentsForSelectedDate}
            getVendorById={getVendorById}
            onEdit={handleEditAppointment}
            onStatusChange={handleStatusChange}
            emptyMessage={t('noAppointmentsScheduled')}
          />
        </CardContent>
      </Card>
    </div>
  );
};
