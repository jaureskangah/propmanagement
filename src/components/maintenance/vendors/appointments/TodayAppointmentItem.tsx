
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Phone, AlertTriangle, Check } from "lucide-react";
import { TodayAppointmentItemProps } from "./types";
import { useLocale } from "@/components/providers/LocaleProvider";

export const TodayAppointmentItem = ({ 
  appointment, 
  vendor, 
  onStatusChange 
}: TodayAppointmentItemProps) => {
  const { t } = useLocale();
  
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
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{appointment.title}</h4>
              {isUpcoming ? (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  {t('upcoming')}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {t('now')}
                </Badge>
              )}
            </div>
            
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>{appointment.time}</span>
              </div>
              
              {vendor && (
                <div className="flex items-center text-muted-foreground">
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span>{vendor.name} ({vendor.specialty})</span>
                </div>
              )}
              
              {vendor && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  <span>{vendor.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1 ml-2">
            <Button 
              size="sm"
              variant="default"
              className="h-8" 
              onClick={() => onStatusChange(appointment.id, 'completed')}
            >
              <Check className="h-4 w-4 mr-1" />
              {t('complete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
