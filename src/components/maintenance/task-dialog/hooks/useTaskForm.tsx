
import { useState } from "react";
import { NewTask } from "../../types";
import { startOfDay, addDays } from "date-fns";

interface UseTaskFormProps {
  onSubmit: (task: NewTask) => void;
  initialDate?: Date;
  initialValue?: NewTask;
}

export const useTaskForm = ({ onSubmit, initialDate, initialValue }: UseTaskFormProps) => {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">(
    initialValue?.type || "regular"
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">(
    initialValue?.priority || "medium"
  );
  const [date, setDate] = useState<Date | undefined>(
    initialValue?.date 
      ? typeof initialValue.date === "string" 
        ? new Date(initialValue.date) 
        : initialValue.date
      : initialDate 
        ? initialDate
        : startOfDay(new Date())
  );
  
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
  const [reminderDate, setReminderDate] = useState<Date | undefined>(
    initialValue?.reminder_date 
      ? typeof initialValue.reminder_date === "string" 
        ? new Date(initialValue.reminder_date) 
        : initialValue.reminder_date
      : date ? addDays(date, -1) : undefined
  );
  const [reminderMethod, setReminderMethod] = useState<"app" | "email" | "both">(
    initialValue?.reminder_method as "app" | "email" | "both" || "app"
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) return;
    
    const newTask: NewTask = {
      title,
      type,
      priority,
      date,
      is_recurring: isRecurring,
      has_reminder: hasReminder,
      reminder_date: hasReminder ? reminderDate : undefined,
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
