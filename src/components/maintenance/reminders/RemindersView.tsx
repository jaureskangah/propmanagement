
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "../types";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BellRing, Calendar, Clock } from "lucide-react";

interface RemindersViewProps {
  tasks: Task[];
}

export const RemindersView = ({ tasks }: RemindersViewProps) => {
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  // Filter tasks with enabled reminders and not completed
  const tasksWithReminders = tasks.filter(task => 
    task.reminder && task.reminder.enabled && 
    !task.completed
  );
  
  console.log("All tasks count:", tasks.length);
  console.log("Tasks with reminders count in view:", tasksWithReminders.length);
  console.log("Reminder tasks data:", tasksWithReminders);
  
  // Sort reminders by date
  const sortedReminders = [...tasksWithReminders].sort((a, b) => {
    const dateA = a.reminder?.date ? new Date(a.reminder.date) : new Date(a.date);
    const dateB = b.reminder?.date ? new Date(b.reminder.date) : new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Filter to show only reminders for the next 7 days
  const today = new Date();
  const nextWeek = addDays(today, 7);
  
  const upcomingReminders = sortedReminders.filter(task => {
    const reminderDate = task.reminder?.date ? new Date(task.reminder.date) : new Date(task.date);
    return isAfter(reminderDate, today) && isBefore(reminderDate, nextWeek);
  });
  
  console.log("Tasks with reminders:", tasksWithReminders.length);
  console.log("Upcoming reminders:", upcomingReminders.length);
  
  if (upcomingReminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
        <BellRing className="h-10 w-10 mb-2 opacity-50" />
        <p>{t('noReminders')}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-3">
        {upcomingReminders.map((task) => {
          const reminderDate = task.reminder?.date ? new Date(task.reminder.date) : new Date(task.date);
          const reminderTime = task.reminder?.time || "09:00";
          
          return (
            <div 
              key={task.id} 
              className="p-3 border rounded-md hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {format(reminderDate, 'dd MMM yyyy', { locale: dateLocale })}
                    </span>
                    <Clock className="h-3 w-3 ml-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {reminderTime}
                    </span>
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
                <Badge variant="outline" className="text-xs flex items-center gap-1 bg-amber-50 text-amber-800 border-amber-200">
                  <BellRing className="h-3 w-3" />
                  {t('taskWithReminder')}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
