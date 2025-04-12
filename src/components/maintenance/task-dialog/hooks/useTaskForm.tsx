
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
  
  // Si une date initiale est fournie, on l'utilise pour setDate
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
      is_recurring: isRecurring,
      ...(isRecurring
        ? {
            recurrence_pattern: {
              frequency: recurrenceFrequency,
              interval: Number(recurrenceInterval),
              weekdays: [],
            },
          }
        : {}),
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
    handleSubmit
  };
};
