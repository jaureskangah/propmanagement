
import { Task } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarClock, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isValidDate, toDate } from "../utils/dateUtils";

interface RecurringTasksViewProps {
  tasks: Task[];
}

export const RecurringTasksView = ({ tasks }: RecurringTasksViewProps) => {
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  // Filter only recurring tasks
  const recurringTasks = tasks.filter(task => Boolean(task.is_recurring) === true);
  
  console.log("RecurringTasksView received tasks:", tasks);
  console.log("Recurring tasks count:", recurringTasks.length);
  
  if (!recurringTasks || recurringTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <RotateCw className="h-10 w-10 mb-2 opacity-50" />
        <p>{t('noRecurringTasks')}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {recurringTasks.map((task) => {
          // Format recurrence text
          let recurrenceText = "";
          if (task.recurrence_pattern) {
            const pattern = task.recurrence_pattern;
            
            if (pattern.frequency === "daily") {
              recurrenceText = pattern.interval > 1 
                ? `${t('repeatsDaily')}, ${t('every')} ${pattern.interval} ${t('days')}`
                : t('repeatsDaily');
            } else if (pattern.frequency === "weekly") {
              recurrenceText = pattern.interval > 1 
                ? `${t('repeatsWeekly')}, ${t('every')} ${pattern.interval} ${t('weeks')}`
                : t('repeatsWeekly');
            } else if (pattern.frequency === "monthly") {
              recurrenceText = pattern.interval > 1 
                ? `${t('repeatsMonthly')}, ${t('every')} ${pattern.interval} ${t('months')}`
                : t('repeatsMonthly');
            }
          }
          
          // Ensure the date is a valid Date object
          const taskDate = toDate(task.date) || new Date();
          
          return (
            <div 
              key={task.id} 
              className="p-3 border rounded-md hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <RotateCw className="h-3 w-3" />
                    {recurrenceText}
                  </p>
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
                  {t(task.type as 'regularTask' | 'inspection' | 'seasonalTask')}
                </Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                  {format(taskDate, 'dd MMM yyyy', { locale: dateLocale })}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
