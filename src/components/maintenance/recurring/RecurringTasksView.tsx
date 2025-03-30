
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "../types";
import { format, isToday, isAfter, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Repeat } from "lucide-react";

interface RecurringTasksViewProps {
  tasks: Task[];
}

export const RecurringTasksView = ({ tasks }: RecurringTasksViewProps) => {
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  // Filtrer uniquement les tâches récurrentes
  const recurringTasks = tasks.filter(task => task.is_recurring);
  
  // Trier les tâches par date
  const sortedTasks = [...recurringTasks].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Filtrer pour n'afficher que les tâches des 30 prochains jours
  const today = new Date();
  const nextMonth = addDays(today, 30);
  
  const upcomingTasks = sortedTasks.filter(task => {
    const taskDate = new Date(task.date);
    return isAfter(taskDate, today) && isBefore(taskDate, nextMonth);
  });
  
  if (recurringTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <Repeat className="h-10 w-10 mb-2 opacity-50" />
        <p>{t('noRecurringTasks')}</p>
      </div>
    );
  }
  
  if (upcomingTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <Repeat className="h-10 w-10 mb-2 opacity-50" />
        <p>{t('noRecurringTasksInRange')}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {upcomingTasks.map((task) => {
          const taskDate = new Date(task.date);
          
          // Simplifier l'affichage de la fréquence
          let frequencyText = "";
          if (task.recurrence_pattern) {
            const { frequency, interval } = task.recurrence_pattern;
            
            if (frequency === "daily") {
              frequencyText = interval === 1 ? 
                t('repeatsDaily') : 
                `${t('repeatsDaily')} ${t('every')} ${interval} ${interval === 1 ? t('day') : t('days')}`;
            } else if (frequency === "weekly") {
              frequencyText = interval === 1 ? 
                t('repeatsWeekly') : 
                `${t('repeatsWeekly')} ${t('every')} ${interval} ${interval === 1 ? t('weekSingular') : t('weeks')}`;
            } else if (frequency === "monthly") {
              frequencyText = interval === 1 ? 
                t('repeatsMonthly') : 
                `${t('repeatsMonthly')} ${t('every')} ${interval} ${interval === 1 ? t('monthSingular') : t('months')}`;
            }
          }
          
          return (
            <div 
              key={task.id} 
              className="p-3 border rounded-md hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="text-xs text-muted-foreground">
                    {format(taskDate, 'dd MMM yyyy', { locale: dateLocale })}
                  </div>
                </div>
                <Badge 
                  variant={
                    task.priority === 'urgent' ? 'destructive' : 
                    task.priority === 'high' ? 'default' :
                    task.priority === 'medium' ? 'secondary' : 'outline'
                  }
                  className="text-xs"
                >
                  {t(task.priority)}
                </Badge>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {t(task.type)}
                </Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1 bg-blue-50 text-blue-800 border-blue-200">
                  <Repeat className="h-3 w-3" />
                  {frequencyText}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
