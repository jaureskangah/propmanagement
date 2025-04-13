
import { Task } from "../../types";
import { format, isAfter, isBefore, addDays, startOfDay, isValid, parseISO } from "date-fns";

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
  
  try {
    // If it's already a Date object
    if (date instanceof Date) {
      return isValid(date) ? startOfDay(date) : null;
    }
    
    // If it's a string
    if (typeof date === 'string') {
      // First try with parseISO (for ISO strings)
      let parsedDate = parseISO(date);
      
      // If that fails, try with regular Date constructor
      if (!isValid(parsedDate)) {
        parsedDate = new Date(date);
      }
      
      return isValid(parsedDate) ? startOfDay(parsedDate) : null;
    }
  } catch (e) {
    console.error("Error parsing date:", date, e);
  }
  
  return null;
}

// Function to group reminders by time period
export function groupRemindersByPeriod(tasks: Task[]) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);

  console.log(`Grouping ${tasks.length} reminders by period`);
  
  // Log reference dates
  console.log("Reference dates:", {
    today: format(today, 'yyyy-MM-dd'),
    tomorrow: format(tomorrow, 'yyyy-MM-dd'),
    nextWeek: format(nextWeek, 'yyyy-MM-dd')
  });

  // Log all tasks being processed
  tasks.forEach(task => {
    if (task.has_reminder && task.reminder_date) {
      console.log(`Processing task for grouping: ${task.id} - ${task.title} - ${
        task.reminder_date instanceof Date 
          ? format(task.reminder_date, 'yyyy-MM-dd') 
          : typeof task.reminder_date === 'string' 
            ? task.reminder_date 
            : 'unknown format'
      }`);
    }
  });

  const todayReminders = tasks.filter(task => {
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    
    const isSameDayResult = isSameDay(reminderDate, today);
    if (isSameDayResult) {
      console.log(`Task ${task.id} is scheduled for TODAY: ${format(reminderDate, 'yyyy-MM-dd')}`);
    }
    return isSameDayResult;
  });
  
  const tomorrowReminders = tasks.filter(task => {
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    
    const isSameDayResult = isSameDay(reminderDate, tomorrow);
    if (isSameDayResult) {
      console.log(`Task ${task.id} is scheduled for TOMORROW: ${format(reminderDate, 'yyyy-MM-dd')}`);
    }
    return isSameDayResult;
  });
  
  const thisWeekReminders = tasks.filter(task => {
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    
    const isAfterTomorrow = isAfter(reminderDate, tomorrow);
    const isBeforeNextWeek = isBefore(reminderDate, nextWeek);
    const isThisWeek = isAfterTomorrow && isBeforeNextWeek;
    
    if (isThisWeek) {
      console.log(`Task ${task.id} is scheduled for THIS WEEK: ${format(reminderDate, 'yyyy-MM-dd')}`);
    }
    
    return isThisWeek;
  });
  
  const laterReminders = tasks.filter(task => {
    const reminderDate = ensureDate(task.reminder_date);
    if (!reminderDate) return false;
    
    const isAfterNextWeek = isAfter(reminderDate, nextWeek);
    
    if (isAfterNextWeek) {
      console.log(`Task ${task.id} is scheduled for LATER: ${format(reminderDate, 'yyyy-MM-dd')}`);
    }
    
    return isAfterNextWeek;
  });

  console.log("Grouped reminders count:", {
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
