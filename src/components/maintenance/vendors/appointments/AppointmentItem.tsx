
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        border-l-4 hover:shadow-md transition-all 
        ${appointment.status === 'completed' ? 'border-l-green-500' : 
          appointment.status === 'cancelled' ? 'border-l-gray-500' : 
          'border-l-amber-500'}
      `}
    >
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
