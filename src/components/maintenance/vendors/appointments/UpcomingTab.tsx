
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { UpcomingHeader } from "./upcoming/UpcomingHeader";
import { UpcomingAppointmentsList } from "./upcoming/UpcomingAppointmentsList";

interface UpcomingTabProps {
  upcomingAppointments: Appointment[];
  getVendorById: (id: string) => Vendor | null;
  handleEditAppointment: (appointment: Appointment) => void;
  handleStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}

export const UpcomingTab = ({
  upcomingAppointments,
  getVendorById,
  handleEditAppointment,
  handleStatusChange
}: UpcomingTabProps) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <UpcomingHeader appointmentsCount={upcomingAppointments.length} />
      </CardHeader>
      <CardContent>
        <UpcomingAppointmentsList 
          appointments={upcomingAppointments}
          getVendorById={getVendorById}
          onEdit={handleEditAppointment}
          onStatusChange={handleStatusChange}
        />
      </CardContent>
    </Card>
  );
};
