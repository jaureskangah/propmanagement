
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { UpcomingAppointmentItem } from "./UpcomingAppointmentItem";

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
  const { t } = useLocale();
  
  return (
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
                <UpcomingAppointmentItem
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
  );
};
