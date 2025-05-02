
import React from "react";
import { Appointment } from "../types";
import { Vendor } from "@/types/vendor";
import { AppointmentItem } from "../AppointmentItem";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AppointmentsListProps {
  appointments: Appointment[];
  getVendorById: (id: string) => Vendor | null;
  onEdit: (appointment: Appointment) => void;
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
  emptyMessage?: string;
}

export const AppointmentsList = ({
  appointments,
  getVendorById,
  onEdit,
  onStatusChange,
  emptyMessage
}: AppointmentsListProps) => {
  const { t } = useLocale();
  
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage || t('noAppointmentsScheduled')}
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {appointments.map(appointment => {
        const vendor = getVendorById(appointment.vendorId);
        return (
          <AppointmentItem
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
