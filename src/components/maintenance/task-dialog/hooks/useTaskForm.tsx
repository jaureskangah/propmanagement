
import { useState } from "react";
import { NewTask } from "../../types";
import { startOfDay, addDays } from "date-fns";

interface UseTaskFormProps {
  onSubmit: (task: NewTask) => void;
  initialDate?: Date;
  initialValue?: NewTask;
}

export const useTaskForm = ({ onSubmit, initialDate, initialValue }: UseTaskFormProps) => {
  // Normaliser la date initiale pour éviter les problèmes
  const normalizeDate = (date: Date | string | undefined): Date => {
    if (!date) return startOfDay(new Date());
    
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return startOfDay(dateObj);
    } catch (error) {
      console.error("Error normalizing date:", error);
      return startOfDay(new Date());
    }
  };
  
  // Initialisation des états avec normalisation des dates
  const initialTaskDate = normalizeDate(initialValue?.date || initialDate);
  
  let initialReminderDate: Date | undefined;
  if (initialValue?.has_reminder && initialValue?.reminder_date) {
    initialReminderDate = normalizeDate(initialValue.reminder_date);
  } else if (initialDate) {
    // Par défaut, le rappel est un jour avant la date de la tâche
    initialReminderDate = addDays(initialTaskDate, -1);
  }
  
  const [title, setTitle] = useState(initialValue?.title || "");
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">(
    initialValue?.type || "regular"
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">(
    initialValue?.priority || "medium"
  );
  const [date, setDate] = useState<Date | undefined>(initialTaskDate);
  
  // Recurrence settings
  const [isRecurring, setIsRecurring] = useState(initialValue?.is_recurring || false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    initialValue?.recurrence_pattern?.frequency || "weekly"
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(
    initialValue?.recurrence_pattern?.interval || 1
  );
  
  // Reminder settings
  const [hasReminder, setHasReminder] = useState(initialValue?.has_reminder || false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(initialReminderDate);
  const [reminderMethod, setReminderMethod] = useState<"app" | "email" | "both">(
    initialValue?.reminder_method as "app" | "email" | "both" || "app"
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) return;
    
    // S'assurer que les dates sont normalisées avant soumission
    const normalizedDate = startOfDay(date);
    let normalizedReminderDate: Date | undefined;
    
    if (hasReminder && reminderDate) {
      normalizedReminderDate = startOfDay(reminderDate);
      
      // Log détaillé pour le débogage
      console.log("Submitting task with reminder:", {
        normalDate: normalizedDate.toISOString(),
        normalReminderDate: normalizedReminderDate.toISOString()
      });
    }
    
    const newTask: NewTask = {
      title,
      type,
      priority,
      date: normalizedDate,
      is_recurring: isRecurring,
      has_reminder: hasReminder,
      reminder_date: normalizedReminderDate,
      reminder_method: hasReminder ? reminderMethod : undefined,
    };
    
    if (isRecurring) {
      newTask.recurrence_pattern = {
        frequency: recurrenceFrequency,
        interval: recurrenceInterval,
        weekdays: [], // Add the missing weekdays property as an empty array
      };
    }
    
    console.log("Submitting task form with data:", newTask);
    
    // Log détaillé pour les rappels
    if (newTask.has_reminder && newTask.reminder_date) {
      console.log(`CRITICAL from useTaskForm: Sending task with reminder:
        Title: ${newTask.title}
        has_reminder: ${newTask.has_reminder}
        reminder_date: ${newTask.reminder_date.toISOString()}
        reminder_method: ${newTask.reminder_method}
      `);
    }
    
    onSubmit(newTask);
  };
  
  return {
    title,
    setTitle,
    type,
    setType,
    priority,
    setPriority,
    date,
    setDate,
    isRecurring,
    setIsRecurring,
    recurrenceFrequency,
    setRecurrenceFrequency,
    recurrenceInterval,
    setRecurrenceInterval,
    hasReminder,
    setHasReminder,
    reminderDate,
    setReminderDate,
    reminderMethod,
    setReminderMethod,
    handleSubmit,
  };
};
