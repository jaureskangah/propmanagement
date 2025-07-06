
import { useState, useEffect } from "react";
import { NewTask, RecurrencePattern } from "../../types";

interface UseTaskFormProps {
  onSubmit: (task: NewTask) => void;
  initialDate?: Date;
  initialValue?: NewTask;
}

export const useTaskForm = ({ onSubmit, initialDate, initialValue }: UseTaskFormProps) => {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">(initialValue?.type || "regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">(initialValue?.priority || "medium");
  const [date, setDate] = useState<Date | undefined>(initialValue?.date instanceof Date ? initialValue.date : initialDate || new Date());
  const [isRecurring, setIsRecurring] = useState(initialValue?.is_recurring || false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(
    initialValue?.recurrence_pattern?.frequency || "weekly"
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(initialValue?.recurrence_pattern?.interval || 1);
  
  // Properties for reminders - Fix the type conversion for reminder_date
  const [hasReminder, setHasReminder] = useState(initialValue?.has_reminder || false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(
    initialValue?.reminder_date instanceof Date 
      ? initialValue.reminder_date 
      : initialValue?.reminder_date 
        ? new Date(initialValue.reminder_date)
        : undefined
  );
  const [reminderMethod, setReminderMethod] = useState<"app" | "email" | "both">(initialValue?.reminder_method || "app");
  
  // Property for property selection
  const [propertyId, setPropertyId] = useState<string>(initialValue?.property_id || localStorage.getItem('selectedPropertyId') || "");
  
  // If an initial date is provided, use it for setDate
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: NewTask = {
      title,
      type,
      priority,
      date: date || new Date(),
      property_id: propertyId,
      is_recurring: isRecurring,
      ...(isRecurring && {
        recurrence_frequency: recurrenceFrequency,
        recurrence_interval: Number(recurrenceInterval),
        recurrence_pattern: {
          frequency: recurrenceFrequency,
          interval: Number(recurrenceInterval)
        }
      }),
      // Add reminder properties
      has_reminder: hasReminder,
      ...(hasReminder && {
        reminder_date: reminderDate,
        reminder_method: reminderMethod,
      }),
    };
    
    console.log("Submitting task with data:", newTask);
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
    propertyId,
    setPropertyId,
    handleSubmit
  };
};
