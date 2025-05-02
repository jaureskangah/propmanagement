
import React from "react";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Appointment } from "../types";
import { Vendor } from "@/types/vendor";
import { TodayAppointmentItem } from "../TodayAppointmentItem";

interface TodayAppointmentsListProps {
  appointments: Appointment[];
  getVendorById: (id: string) => Vendor | null;
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}

export const TodayAppointmentsList = ({
  appointments,
  getVendorById,
  onStatusChange
}: TodayAppointmentsListProps) => {
  const { t } = useLocale();

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
        <CalendarIcon className="h-8 w-8 mb-2 text-muted-foreground/60" />
        {t('noAppointmentsToday')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map(appointment => {
        const vendor = getVendorById(appointment.vendorId);
        
        return (
          <TodayAppointmentItem
            key={appointment.id}
            appointment={appointment}
            vendor={vendor}
            onStatusChange={onStatusChange}
          />
        );
      })}
    </div>
  );
};
