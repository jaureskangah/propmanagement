
import { useMemo } from "react";
import { format, isToday, isYesterday, isSameWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity, GroupedActivities } from "../activityTypes";
import { useLocale } from "@/components/providers/LocaleProvider";

export function useActivityGrouping(activities: Activity[]) {
  const { t, language } = useLocale();
  
  return useMemo(() => {
    const grouped: GroupedActivities = {};
    
    if (activities.length === 0) {
      console.log("Aucune activité à grouper après filtrage");
      return grouped;
    }
    
    activities.forEach(activity => {
      const date = new Date(activity.created_at);
      let dateKey: string;
      
      if (isToday(date)) {
        dateKey = t('today');
      } else if (isYesterday(date)) {
        dateKey = t('yesterday');
      } else if (isSameWeek(date, new Date(), { weekStartsOn: 1 })) {
        dateKey = t('thisWeek');
      } else {
        // Format by month and year for older activities
        dateKey = format(date, "MMMM yyyy", {
          locale: language === 'fr' ? fr : undefined
        });
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(activity);
    });
    
    console.log("Activités groupées par période:", Object.keys(grouped));
    return grouped;
  }, [activities, t, language]);
}
