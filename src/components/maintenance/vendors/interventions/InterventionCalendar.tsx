
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { VendorIntervention } from "@/types/vendor";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";

interface InterventionCalendarProps {
  interventions: VendorIntervention[];
}

export const InterventionCalendar = ({ interventions }: InterventionCalendarProps) => {
  const { t } = useLocale();
  
  // Convertir correctement les dates en objets Date
  const modifiers = {
    intervention: interventions.map(int => new Date(int.date))
  };

  const modifiersStyles = {
    intervention: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50%'
    }
  };

  // Journées avec des interventions
  const daysWithInterventions = interventions.reduce((acc, int) => {
    const dateKey = new Date(int.date).toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    acc[dateKey]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Badge variant="default">{t('scheduledIntervention')}</Badge>
      </div>
      
      {interventions.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          {t('noInterventions')}
        </p>
      ) : (
        <>
          <Calendar
            mode="multiple"
            selected={modifiers.intervention}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
          <div className="text-sm text-muted-foreground mt-2">
            {Object.keys(daysWithInterventions).length > 0 && (
              <p>{t('interventionsCount', { count: interventions.length.toString() })}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
