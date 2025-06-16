
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BorderTrail } from "@/components/ui/border-trail";
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
        relative border-l-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
        ${isUpcoming ? 'border-l-amber-500' : 'border-l-red-500'}
      `}
    >
      <BorderTrail
        className={`
          ${isUpcoming ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500' : 
            'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500'}
        `}
        size={45}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          boxShadow: `0px 0px 25px 12px ${isUpcoming ? 'rgb(245 158 11 / 20%)' : 'rgb(239 68 68 / 20%)'}`
        }}
      />
      
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
