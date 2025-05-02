
import React from "react";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Appointment } from "../types";
import { Vendor } from "@/types/vendor";
import { UpcomingAppointmentItem } from "../UpcomingAppointmentItem";

interface UpcomingAppointmentsListProps {
  appointments: Appointment[];
  getVendorById: (id: string) => Vendor | null;
  onEdit: (appointment: Appointment) => void;
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}

export const UpcomingAppointmentsList = ({
  appointments,
  getVendorById,
  onEdit,
  onStatusChange
}: UpcomingAppointmentsListProps) => {
  const { t } = useLocale();
  
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
        <CalendarIcon className="h-8 w-8 mb-2 text-muted-foreground/60" />
        {t('noUpcomingAppointments')}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {appointments.map(appointment => {
        const vendor = getVendorById(appointment.vendorId);
        return (
          <UpcomingAppointmentItem
            key={appointment.id}
            appointment={appointment}
            vendor={vendor}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        );
      })}
    </div>
  );
};
