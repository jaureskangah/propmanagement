
import React from "react";
import { Calendar as CalendarIcon, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AppointmentActionsProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onStatusChange: (appointmentId: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => void;
  variant?: 'default' | 'today' | 'upcoming';
}

export const AppointmentActions = ({ 
  appointment, 
  onEdit, 
  onStatusChange,
  variant = 'default'
}: AppointmentActionsProps) => {
  const { t } = useLocale();

  if (appointment.status !== 'scheduled') {
    return null;
  }
  
  if (variant === 'today') {
    return (
      <div className="ml-2">
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
    );
  }
  
  return (
    <div className="flex flex-col gap-1 ml-2">
      {onEdit && (
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7" 
          onClick={() => onEdit(appointment)}
          title={t('edit')}
        >
          <CalendarIcon className="h-4 w-4" />
        </Button>
      )}
      
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => onStatusChange(appointment.id, 'completed')}
        title={t('markAsCompleted')}
      >
        <Check className="h-4 w-4" />
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
  );
};
