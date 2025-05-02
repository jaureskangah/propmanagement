
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UpcomingAppointmentItemProps } from "./types";
import { AppointmentHeader } from "./shared/AppointmentHeader";
import { AppointmentInfo } from "./shared/AppointmentInfo";
import { AppointmentActions } from "./shared/AppointmentActions";

export const UpcomingAppointmentItem = ({ 
  appointment, 
  vendor, 
  onEdit, 
  onStatusChange 
}: UpcomingAppointmentItemProps) => {
  return (
    <Card
      key={appointment.id}
      className="border-l-4 border-l-amber-500 hover:shadow-md transition-all"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <AppointmentHeader
              appointment={appointment}
              showTodayBadge={true}
            />
            
            <AppointmentInfo 
              appointment={appointment} 
              vendor={vendor}
              showDate={true} 
            />
          </div>
          
          <AppointmentActions 
            appointment={appointment} 
            onEdit={onEdit} 
            onStatusChange={onStatusChange}
            variant="upcoming" 
          />
        </div>
      </CardContent>
    </Card>
  );
};
