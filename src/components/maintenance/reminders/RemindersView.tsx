
import { Task } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { BellRing, Calendar, Mail, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isValidDate, toDate } from "../utils/dateUtils";

interface RemindersViewProps {
  tasks: Task[];
}

export const RemindersView = ({ tasks }: RemindersViewProps) => {
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  // Filter only tasks with reminders
  const tasksWithReminder = tasks.filter(task => Boolean(task.has_reminder) === true && task.reminder_date);
  
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

  // Sort reminders by date (closest first)
  const sortedReminders = [...tasksWithReminder].sort((a, b) => {
    if (!a.reminder_date || !b.reminder_date) return 0;
    
    // Ensure both dates are Date objects
    const dateA = toDate(a.reminder_date) || new Date();
    const dateB = toDate(b.reminder_date) || new Date();
    
    return dateA.getTime() - dateB.getTime();
  });

  // Group reminders by period
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const todayReminders = sortedReminders.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = toDate(task.reminder_date) || new Date();
    return isSameDay(reminderDate, today);
  });
  
  const tomorrowReminders = sortedReminders.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = toDate(task.reminder_date) || new Date();
    return isSameDay(reminderDate, tomorrow);
  });
  
  const thisWeekReminders = sortedReminders.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = toDate(task.reminder_date) || new Date();
    return isAfter(reminderDate, tomorrow) && 
      isBefore(reminderDate, nextWeek);
  });
  
  const laterReminders = sortedReminders.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = toDate(task.reminder_date) || new Date();
    return isAfter(reminderDate, nextWeek);
  });

  function isSameDay(date1: Date, date2: Date) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  function getReminderMethodIcon(method?: string) {
    switch (method) {
      case "email":
        return <Mail className="h-3 w-3 text-blue-500" />;
      case "app":
        return <Smartphone className="h-3 w-3 text-green-500" />;
      case "both":
        return (
          <div className="flex gap-1">
            <Smartphone className="h-3 w-3 text-green-500" />
            <Mail className="h-3 w-3 text-blue-500" />
          </div>
        );
      default:
        return <BellRing className="h-3 w-3" />;
    }
  }

  function getReminderMethodLabel(method?: string) {
    switch (method) {
      case "email":
        return t('reminderViaEmail');
      case "app":
        return t('reminderViaApp');
      case "both":
        return t('reminderViaBoth');
      default:
        return "";
    }
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
    return reminderGroup.map((task) => {
      // Ensure reminder_date is a Date object
      const reminderDate = toDate(task.reminder_date) || new Date();
      
      // Ensure task date is a Date object
      const taskDate = toDate(task.date) || new Date();
        
      return (
        <div 
          key={task.id} 
          className="p-3 border rounded-md hover:bg-accent/20 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{task.title}</h4>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <BellRing className="h-3 w-3 mr-1" />
                {format(reminderDate, 'dd MMM yyyy', { locale: dateLocale })}
                <span className="mx-1">•</span>
                {getReminderMethodIcon(task.reminder_method)}
                <span className="text-xs">{getReminderMethodLabel(task.reminder_method)}</span>
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
              {t(task.priority as 'low' | 'medium' | 'high' | 'urgent')}
            </Badge>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {t(task.type as 'regularTask' | 'inspection' | 'seasonalTask')}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(taskDate, 'dd MMM yyyy', { locale: dateLocale })}
            </Badge>
          </div>
        </div>
      );
    });
  }
};
