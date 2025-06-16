
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BorderTrail } from "@/components/ui/border-trail";
import { AppointmentItemProps } from "./types";
import { AppointmentHeader } from "./shared/AppointmentHeader";
import { AppointmentInfo } from "./shared/AppointmentInfo";
import { AppointmentActions } from "./shared/AppointmentActions";

export const AppointmentItem = ({ 
  appointment, 
  vendor, 
  onEdit, 
  onStatusChange 
}: AppointmentItemProps) => {
  return (
    <Card
      key={appointment.id}
      className={`
        relative border-l-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
        ${appointment.status === 'completed' ? 'border-l-green-500' : 
          appointment.status === 'cancelled' ? 'border-l-gray-500' : 
          'border-l-amber-500'}
      `}
    >
      <BorderTrail
        className={`
          ${appointment.status === 'completed' ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500' : 
            appointment.status === 'cancelled' ? 'bg-gradient-to-r from-gray-500 via-slate-500 to-zinc-500' : 
            'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'}
        `}
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
            <AppointmentHeader appointment={appointment} />
            <AppointmentInfo 
              appointment={appointment} 
              vendor={vendor} 
              showVendorPhone={true} 
            />
          </div>
          
          <AppointmentActions 
            appointment={appointment} 
            onEdit={onEdit} 
            onStatusChange={onStatusChange} 
          />
        </div>
      </CardContent>
    </Card>
  );
};
