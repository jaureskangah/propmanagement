
import React from "react";
import { format, isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, X } from "lucide-react";
import { UpcomingAppointmentItemProps } from "./types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { fr, enUS } from 'date-fns/locale';

export const UpcomingAppointmentItem = ({ 
  appointment, 
  vendor, 
  onEdit, 
  onStatusChange 
}: UpcomingAppointmentItemProps) => {
  const { t, locale } = useLocale();
  
  return (
    <Card
      key={appointment.id}
      className="border-l-4 border-l-amber-500 hover:shadow-md transition-all"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{appointment.title}</h4>
              {isToday(appointment.date) && (
                <Badge className="bg-red-500">
                  {t('today')}
                </Badge>
              )}
            </div>
            
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center font-medium">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                <span>{format(appointment.date, 'PPP', { locale: locale === 'fr' ? fr : enUS })}</span>
              </div>
              
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
            </div>
          </div>
          
          <div className="flex flex-col gap-1 ml-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7" 
              onClick={() => onEdit(appointment)}
              title={t('edit')}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onStatusChange(appointment.id, 'cancelled')}
              title={t('cancel')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
