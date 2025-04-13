
import { Task } from "../../types";
import { format, isAfter, isBefore, addDays, startOfDay, isValid } from "date-fns";

// Function to determine if two dates represent the same day
export function isSameDay(date1: Date, date2: Date) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}

// Function to get the appropriate reminder method icon name
export function getReminderMethodIcon(method?: string) {
  switch (method) {
    case "email":
      return "Mail";
    case "app":
      return "Smartphone";
    case "both":
      return "Both";
    default:
      return "BellRing";
  }
}

// Function to determine if a task is a scheduled call
export function isScheduledCall(task: Task) {
  return task.title?.toLowerCase().includes('appel') || task.title?.toLowerCase().includes('call');
}

// Function to get the appropriate task type icon name
export function getTaskTypeIcon(task: Task) {
  if (isScheduledCall(task)) {
    return "PhoneCall";
  }
  return "Calendar";
}

// Function to get the label for the reminder method
export function getReminderMethodLabel(t: (key: string) => string, method?: string) {
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

// Function to safely convert any date representation to a Date object
export function ensureDate(date: Date | string | undefined): Date | null {
  if (!date) return null;
  
  if (date instanceof Date) {
    return isValid(date) ? startOfDay(date) : null;
  }
  
  try {
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? startOfDay(parsedDate) : null;
  } catch (e) {
    console.error("Error parsing date:", e);
    return null;
  }
}

// Function to group reminders by time period
export function groupRemindersByPeriod(tasks: Task[]) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  const todayReminders = tasks.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    return isSameDay(reminderDate, today);
  });
  
  const tomorrowReminders = tasks.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    return isSameDay(reminderDate, tomorrow);
  });
  
  const thisWeekReminders = tasks.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    return isAfter(reminderDate, tomorrow) && 
      isBefore(reminderDate, nextWeek);
  });
  
  const laterReminders = tasks.filter(task => {
    if (!task.reminder_date) return false;
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    return isAfter(reminderDate, nextWeek);
  });

  console.log("Grouped reminders:", {
    today: todayReminders.length,
    tomorrow: tomorrowReminders.length,
    thisWeek: thisWeekReminders.length,
    later: laterReminders.length
  });

  return {
    todayReminders,
    tomorrowReminders,
    thisWeekReminders,
    laterReminders
  };
}
