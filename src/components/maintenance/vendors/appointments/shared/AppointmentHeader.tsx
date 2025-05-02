
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { isToday } from "date-fns";

interface AppointmentHeaderProps {
  appointment: Appointment;
  showTodayBadge?: boolean;
  variant?: 'default' | 'upcoming' | 'today';
}

export const AppointmentHeader = ({ 
  appointment, 
  showTodayBadge = true,
  variant = 'default'
}: AppointmentHeaderProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex items-center gap-2">
      <h4 className="font-medium">{appointment.title}</h4>
      
      {showTodayBadge && isToday(appointment.date) && (
        variant === 'today' ? (
          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
            {t('now')}
          </Badge>
        ) : (
          <Badge className="bg-red-500">
            {t('today')}
          </Badge>
        )
      )}
      
      {variant === 'upcoming' && (
        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
          {t('upcoming')}
        </Badge>
      )}
      
      {appointment.status !== 'scheduled' && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          appointment.status === 'completed' 
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {appointment.status === 'completed' 
            ? t('completed')
            : t('cancelled')
          }
        </span>
      )}
    </div>
  );
};
