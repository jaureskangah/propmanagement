
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isToday } from "date-fns";
import { fr, enUS } from 'date-fns/locale';
import { useLocale } from "@/components/providers/LocaleProvider";

interface DateHeaderProps {
  selectedDate: Date | undefined;
}

export const DateHeader = ({ selectedDate }: DateHeaderProps) => {
  const { t, locale } = useLocale();
  
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-sm">
        {selectedDate ? (
          format(selectedDate, 'PPP', { locale: locale === 'fr' ? fr : enUS })
        ) : (
          t('noDateSelected')
        )}
      </CardTitle>
      {selectedDate && isToday(selectedDate) && (
        <Badge className="bg-blue-500">{t('today')}</Badge>
      )}
    </div>
  );
};
