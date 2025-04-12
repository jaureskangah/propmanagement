
import { Task } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyReminders } from "./EmptyReminders";
import { ReminderGroup } from "./ReminderGroup";
import { groupRemindersByPeriod } from "./utils/reminderUtils";

interface RemindersViewProps {
  tasks: Task[];
}

export const RemindersView = ({ tasks }: RemindersViewProps) => {
  const { t } = useLocale();
  
  console.log("RemindersView received tasks:", tasks.length);
  
  // Simple validation check to ensure we only accept tasks with has_reminder=true
  // and a valid reminder_date
  const tasksWithReminder = tasks.filter(task => {
    if (!task.has_reminder) {
      return false;
    }
    
    // Ensure the reminder_date exists and can be parsed to a valid Date
    if (!task.reminder_date) {
      return false;
    }
    
    // For debugging - log each valid reminder task
    console.log(`Valid reminder task: ${task.id} - ${task.title} - ${task.reminder_date}`);
    return true;
  });
  
  console.log("Tasks with reminders after filtering:", tasksWithReminder.length);
  
  if (tasksWithReminder.length === 0) {
    return <EmptyReminders />;
  }

  // Sort reminders by date (closest first)
  const sortedReminders = [...tasksWithReminder].sort((a, b) => {
    if (!a.reminder_date || !b.reminder_date) return 0;
    
    // Ensure both dates are Date objects
    const dateA = a.reminder_date instanceof Date ? a.reminder_date : new Date(a.reminder_date);
    const dateB = b.reminder_date instanceof Date ? b.reminder_date : new Date(b.reminder_date);
    
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
