
import { Task } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { BellRing, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RemindersViewProps {
  tasks: Task[];
}

export const RemindersView = ({ tasks }: RemindersViewProps) => {
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  // Filtrer uniquement les tâches avec rappel
  const tasksWithReminder = tasks.filter(task => task.has_reminder && task.reminder_date);
  
  console.log("RemindersView received tasks:", tasks.length);
  console.log("Tasks with reminders:", tasksWithReminder.length);
  
  if (!tasksWithReminder || tasksWithReminder.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <BellRing className="h-10 w-10 mb-2 opacity-50" />
        <p>{t('noReminders')}</p>
      </div>
    );
  }

  // Trier les rappels par date (les plus proches en premier)
  const sortedReminders = [...tasksWithReminder].sort((a, b) => {
    if (!a.reminder_date || !b.reminder_date) return 0;
    return a.reminder_date.getTime() - b.reminder_date.getTime();
  });

  // Regrouper les rappels par période
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const todayReminders = sortedReminders.filter(task => 
    task.reminder_date && 
    isSameDay(task.reminder_date, today)
  );
  
  const tomorrowReminders = sortedReminders.filter(task => 
    task.reminder_date && 
    isSameDay(task.reminder_date, tomorrow)
  );
  
  const thisWeekReminders = sortedReminders.filter(task => 
    task.reminder_date && 
    isAfter(task.reminder_date, tomorrow) && 
    isBefore(task.reminder_date, nextWeek)
  );
  
  const laterReminders = sortedReminders.filter(task => 
    task.reminder_date && 
    isAfter(task.reminder_date, nextWeek)
  );

  function isSameDay(date1: Date, date2: Date) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {todayReminders.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t('today')}</h3>
            <div className="space-y-2">
              {renderReminderGroup(todayReminders)}
            </div>
          </div>
        )}
        
        {tomorrowReminders.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t('tomorrow')}</h3>
            <div className="space-y-2">
              {renderReminderGroup(tomorrowReminders)}
            </div>
          </div>
        )}
        
        {thisWeekReminders.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t('thisWeek')}</h3>
            <div className="space-y-2">
              {renderReminderGroup(thisWeekReminders)}
            </div>
          </div>
        )}
        
        {laterReminders.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">{t('later')}</h3>
            <div className="space-y-2">
              {renderReminderGroup(laterReminders)}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
  
  function renderReminderGroup(reminderGroup: Task[]) {
    return reminderGroup.map((task) => (
      <div 
        key={task.id} 
        className="p-3 border rounded-md hover:bg-accent/20 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <BellRing className="h-3 w-3" />
              {task.reminder_date && format(task.reminder_date, 'dd MMM yyyy', { locale: dateLocale })}
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
            <Calendar className="h-3 w-3" />
            {format(new Date(task.date), 'dd MMM yyyy', { locale: dateLocale })}
          </Badge>
        </div>
      </div>
    ));
  }
};
