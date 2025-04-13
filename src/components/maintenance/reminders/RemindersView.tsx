
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
  
  // Simple filter to ensure we have valid tasks with reminders
  const validReminderTasks = tasks.filter(task => {
    // Only include tasks that have reminders enabled
    if (!task.has_reminder) return false;
    
    // And have a valid reminder date
    return task.reminder_date instanceof Date || 
           (typeof task.reminder_date === 'string' && task.reminder_date);
  });
  
  console.log("Valid reminder tasks count:", validReminderTasks.length);
  
  if (validReminderTasks.length === 0) {
    return <EmptyReminders />;
  }

  // Group the reminders by period
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
