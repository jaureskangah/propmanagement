
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { TodayHeader } from "./today/TodayHeader";
import { TodayAppointmentsList } from "./today/TodayAppointmentsList";

interface TodayTabProps {
  todayAppointments: Appointment[];
  getVendorById: (id: string) => Vendor | null;
  handleStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
}

export const TodayTab = ({
  todayAppointments,
  getVendorById,
  handleStatusChange
}: TodayTabProps) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <TodayHeader appointmentsCount={todayAppointments.length} />
      </CardHeader>
      <CardContent>
        <TodayAppointmentsList 
          appointments={todayAppointments}
          getVendorById={getVendorById}
          onStatusChange={handleStatusChange}
        />
      </CardContent>
    </Card>
  );
};
