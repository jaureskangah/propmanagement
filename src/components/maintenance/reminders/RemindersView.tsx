
import { Task } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyReminders } from "./EmptyReminders";
import { ReminderGroup } from "./ReminderGroup";
import { groupRemindersByPeriod } from "./utils/reminderUtils";
import { format } from "date-fns";

interface RemindersViewProps {
  tasks: Task[];
}

export const RemindersView = ({ tasks }: RemindersViewProps) => {
  const { t } = useLocale();
  
  console.log("RemindersView received tasks:", tasks.length);
  
  // Logs plus détaillés pour diagnostiquer le problème
  tasks.forEach(task => {
    if (task.has_reminder) {
      console.log(`Reminder task in component:
        ID: ${task.id}
        Title: ${task.title}
        has_reminder: ${task.has_reminder}
        reminder_date: ${task.reminder_date instanceof Date 
          ? format(task.reminder_date, 'yyyy-MM-dd') 
          : (task.reminder_date || 'undefined')}
        reminder_method: ${task.reminder_method || 'None'}
      `);
    }
  });
  
  // Filtrage amélioré des tâches avec rappels valides
  const validReminderTasks = tasks.filter(task => {
    // La tâche doit avoir un rappel activé
    if (!task.has_reminder) return false;
    
    // La date de rappel doit exister
    if (!task.reminder_date) {
      console.log(`Task ${task.id} has has_reminder=true but no reminder_date`);
      return false;
    }
    
    // S'assurer que la date est un objet Date valide
    let reminderDate;
    try {
      reminderDate = task.reminder_date instanceof Date 
        ? task.reminder_date 
        : new Date(task.reminder_date as string);
      
      if (isNaN(reminderDate.getTime())) {
        console.log(`Task ${task.id} has invalid reminder_date (NaN)`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error parsing reminder_date for task ${task.id}:`, error);
      return false;
    }
  });
  
  console.log("Valid reminder tasks count:", validReminderTasks.length);
  
  if (validReminderTasks.length === 0) {
    return <EmptyReminders />;
  }

  // Regrouper les rappels par période
  const { 
    todayReminders, 
    tomorrowReminders, 
    thisWeekReminders, 
    laterReminders 
  } = groupRemindersByPeriod(validReminderTasks);
  
  console.log("Grouped reminders:", {
    today: todayReminders.length,
    tomorrow: tomorrowReminders.length,
    thisWeek: thisWeekReminders.length,
    later: laterReminders.length
  });

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        <ReminderGroup title={t('today')} tasks={todayReminders} />
        <ReminderGroup title={t('tomorrow')} tasks={tomorrowReminders} />
        <ReminderGroup title={t('thisWeek')} tasks={thisWeekReminders} />
        <ReminderGroup title={t('later')} tasks={laterReminders} />
      </div>
    </ScrollArea>
  );
};
