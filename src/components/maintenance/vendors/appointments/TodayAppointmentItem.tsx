
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TodayAppointmentItemProps } from "./types";
import { AppointmentHeader } from "./shared/AppointmentHeader";
import { AppointmentInfo } from "./shared/AppointmentInfo";
import { AppointmentActions } from "./shared/AppointmentActions";

export const TodayAppointmentItem = ({ 
  appointment, 
  vendor, 
  onStatusChange 
}: TodayAppointmentItemProps) => {
  const now = new Date();
  const [hours, minutes] = appointment.time.split(':').map(Number);
  const appointmentTime = new Date();
  appointmentTime.setHours(hours, minutes);
  const isUpcoming = appointmentTime > now;
  
  return (
    <Card
      key={appointment.id}
      className={`
        border-l-4 hover:shadow-md transition-all 
        ${isUpcoming ? 'border-l-amber-500' : 'border-l-red-500'}
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <AppointmentHeader 
              appointment={appointment} 
              showTodayBadge={false}
              variant="today"
            />
            
            <AppointmentInfo 
              appointment={appointment} 
              vendor={vendor} 
              showVendorPhone={true} 
            />
          </div>
          
          <AppointmentActions 
            appointment={appointment}
            onStatusChange={onStatusChange}
            variant="today"
          />
        </div>
      </CardContent>
    </Card>
  );
};
