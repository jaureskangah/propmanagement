
import React from "react";
import { Clock, User, Phone, Mail, Bell } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { Appointment } from "../types";
import { Vendor } from "@/types/vendor";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AppointmentInfoProps {
  appointment: Appointment;
  vendor: Vendor | null;
  showDate?: boolean;
  showVendorPhone?: boolean;
}

export const AppointmentInfo = ({ 
  appointment, 
  vendor, 
  showDate = false,
  showVendorPhone = false
}: AppointmentInfoProps) => {
  const { t, locale } = useLocale();
  
  return (
    <div className="mt-2 space-y-1 text-sm">
      {showDate && (
        <div className="flex items-center font-medium">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>{format(appointment.date, 'PPP', { locale: locale === 'fr' ? fr : enUS })}</span>
        </div>
      )}
      
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
      
      {vendor && showVendorPhone && (
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
  );
};
