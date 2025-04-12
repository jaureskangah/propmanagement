
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { ReminderSettings } from "./ReminderSettings";
import { DatePickerField } from "./form-fields/DatePickerField";
import { TaskTypeSelect } from "./form-fields/TaskTypeSelect";
import { PrioritySelect } from "./form-fields/PrioritySelect";

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
  onCancel?: () => void;
  initialDate?: Date;
}

export const TaskForm = ({ onSubmit, onCancel, initialDate }: TaskFormProps) => {
  // Create today's date without time component to avoid timezone issues
  const today = startOfDay(new Date());
  
  // Use initial date if provided, otherwise use today's date
  const [date, setDate] = useState<Date | undefined>(initialDate ? startOfDay(initialDate) : today);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(initialDate ? startOfDay(initialDate) : today);
  const [reminderMethod, setReminderMethod] = useState<"app" | "email" | "both">("app");
  
  const { t, language } = useLocale();
  
  const dateLocale = language === 'fr' ? fr : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && type) {
      // Make sure we use normalized dates without time components
      const submissionDate = startOfDay(date);
      const submissionReminderDate = reminderDate ? startOfDay(reminderDate) : undefined;
      
      console.log("Submitting task with date:", format(submissionDate, "yyyy-MM-dd"), "Original selected date:", format(date, "yyyy-MM-dd"));
      console.log("Reminder date:", submissionReminderDate ? format(submissionReminderDate, "yyyy-MM-dd") : "none", 
                 "has reminder:", hasReminder, "method:", reminderMethod);
      
      const newTask: NewTask = { 
        title,
        date: submissionDate,
        type,
        priority,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? {
          frequency: recurrenceFrequency,
          interval: recurrenceInterval,
          weekdays: [],
          end_date: undefined
        } : undefined,
        has_reminder: hasReminder,
        reminder_date: hasReminder ? submissionReminderDate : undefined,
        reminder_method: hasReminder ? reminderMethod : undefined
      };
      
      console.log("Full task data being submitted:", newTask);
      onSubmit(newTask);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t('taskTitle')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('taskTitle')}
          required
        />
      </div>
      
      <DatePickerField 
        label={t('date')}
        date={date}
        onDateChange={setDate}
        locale={dateLocale}
      />
      
      <PrioritySelect 
        value={priority}
        onChange={setPriority}
        label={t('priority')}
      />
      
      <TaskTypeSelect 
        value={type}
        onChange={setType}
        label={t('taskType')}
      />
      
      <RecurrenceSettings 
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        recurrenceFrequency={recurrenceFrequency}
        setRecurrenceFrequency={setRecurrenceFrequency}
        recurrenceInterval={recurrenceInterval}
        setRecurrenceInterval={setRecurrenceInterval}
      />
      
      <ReminderSettings
        hasReminder={hasReminder}
        setHasReminder={setHasReminder}
        reminderDate={reminderDate}
        setReminderDate={setReminderDate}
        reminderMethod={reminderMethod}
        setReminderMethod={setReminderMethod}
        dateLocale={dateLocale}
      />
      
      <Separator className="my-2" />
      
      <Button type="submit" className="w-full">
        <CheckCircle className="h-4 w-4 mr-2" />
        {t('addTask')}
      </Button>
    </form>
  );
};
