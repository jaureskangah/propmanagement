
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { fr, enUS } from 'date-fns/locale';
import { isSameDay } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Appointment } from "../types";

interface AppointmentCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  appointments: Appointment[];
}

export const AppointmentCalendar = ({
  selectedDate,
  setSelectedDate,
  appointments
}: AppointmentCalendarProps) => {
  const { locale } = useLocale();
  
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      className="rounded-md border w-full"
      locale={locale === 'fr' ? fr : enUS}
      modifiers={{
        withAppointments: appointments
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
  );
};
