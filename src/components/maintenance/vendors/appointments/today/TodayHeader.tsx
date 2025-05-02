
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { useLocale } from "@/components/providers/LocaleProvider";

interface TodayHeaderProps {
  appointmentsCount: number;
}

export const TodayHeader = ({ appointmentsCount }: TodayHeaderProps) => {
  const { t, locale } = useLocale();
  
  return (
    <div className="flex justify-between items-center">
      <CardTitle>
        {t('todayAppointments')}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({format(new Date(), 'PPP', { locale: locale === 'fr' ? fr : enUS })})
        </span>
      </CardTitle>
      <Badge className="bg-blue-500">{appointmentsCount}</Badge>
    </div>
  );
};
