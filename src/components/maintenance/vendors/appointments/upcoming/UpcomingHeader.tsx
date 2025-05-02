
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";

interface UpcomingHeaderProps {
  appointmentsCount: number;
}

export const UpcomingHeader = ({ appointmentsCount }: UpcomingHeaderProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex justify-between items-center">
      <CardTitle>
        {t('upcomingAppointments')}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({t('next7Days')})
        </span>
      </CardTitle>
      <Badge className="bg-blue-500">{appointmentsCount}</Badge>
    </div>
  );
};
