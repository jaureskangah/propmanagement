
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Bell, Check, X } from "lucide-react";
import { AppointmentItemProps } from "./types";
import { useLocale } from "@/components/providers/LocaleProvider";

export const AppointmentItem = ({ 
  appointment, 
  vendor, 
  onEdit, 
  onStatusChange 
}: AppointmentItemProps) => {
  const { t } = useLocale();
  
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
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{appointment.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                appointment.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : appointment.status === 'cancelled'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {appointment.status === 'completed' 
                  ? t('completed')
                  : appointment.status === 'cancelled'
                  ? t('cancelled')
                  : t('scheduled')
                }
              </span>
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
              
              {appointment.notes && (
                <div className="text-muted-foreground mt-1 italic border-l-2 border-muted pl-2">
                  {appointment.notes}
                </div>
              )}
              
              {appointment.sendEmail && (
                <div className="flex items-center text-green-600">
                  <Mail className="h-3.5 w-3.5 mr-1" />
                  <span>{t('emailNotificationSent')}</span>
                </div>
              )}
              
              {appointment.setReminder && (
                <div className="flex items-center text-amber-600">
                  <Bell className="h-3.5 w-3.5 mr-1" />
                  <span>{appointment.reminderSent ? t('reminderSent') : t('reminderScheduled')}</span>
                </div>
              )}
            </div>
          </div>
          
          {appointment.status === 'scheduled' && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};
