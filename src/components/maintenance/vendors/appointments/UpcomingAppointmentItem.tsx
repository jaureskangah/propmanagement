
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BorderTrail } from "@/components/ui/border-trail";
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
      className="relative border-l-4 border-l-amber-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      <BorderTrail
        className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"
        size={45}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          boxShadow: "0px 0px 25px 12px rgb(245 158 11 / 20%)"
        }}
      />
      
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
