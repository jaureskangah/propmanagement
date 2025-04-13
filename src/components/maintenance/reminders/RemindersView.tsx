
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
  
  // Amélioration du filtrage des tâches avec rappels valides
  const tasksWithReminder = tasks.filter(task => {
    // Vérification que la tâche a un rappel activé
    if (!task.has_reminder) {
      return false;
    }
    
    // Vérification que la date de rappel existe
    if (!task.reminder_date) {
      console.log(`Filtered out task ${task.id} - has_reminder=true but no reminder_date`);
      return false;
    }
    
    // Normaliser la date de rappel pour s'assurer qu'elle est une Date valide
    const reminderDate = task.reminder_date instanceof Date 
      ? task.reminder_date 
      : new Date(task.reminder_date as string);
    
    // Vérifier si la date de rappel est valide
    if (isNaN(reminderDate.getTime())) {
      console.log(`Filtered out task ${task.id} - invalid reminder_date`);
      return false;
    }
    
    // Pour le débogage - log chaque tâche avec rappel valide
    console.log(`Valid reminder task: ${task.id} - ${task.title} - Reminder date: ${
      format(reminderDate, "yyyy-MM-dd")
    }`);
    
    return true;
  });
  
  console.log("Tasks with reminders after filtering:", tasksWithReminder.length);
  
  if (tasksWithReminder.length === 0) {
    return <EmptyReminders />;
  }

  // Tri des rappels par date (les plus proches d'abord)
  const sortedReminders = [...tasksWithReminder].sort((a, b) => {
    if (!a.reminder_date || !b.reminder_date) return 0;
    
    // Ensure both dates are Date objects
    const dateA = a.reminder_date instanceof Date ? a.reminder_date : new Date(a.reminder_date as string);
    const dateB = b.reminder_date instanceof Date ? b.reminder_date : new Date(b.reminder_date as string);
    
    // Debug sorting
    console.log(`Comparing dates: ${dateA.toISOString()} vs ${dateB.toISOString()}`);
    
    return dateA.getTime() - dateB.getTime();
  });

  // Group reminders by period
  const { 
    todayReminders, 
    tomorrowReminders, 
    thisWeekReminders, 
    laterReminders 
  } = groupRemindersByPeriod(sortedReminders);

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
