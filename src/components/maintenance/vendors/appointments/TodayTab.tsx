
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Appointment } from "./types";
import { Vendor } from "@/types/vendor";
import { TodayAppointmentItem } from "./TodayAppointmentItem";

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
  const { t, locale } = useLocale();
  
  return (
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
              
              return (
                <TodayAppointmentItem
                  key={appointment.id}
                  appointment={appointment}
                  vendor={vendor}
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
