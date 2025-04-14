
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "./form-fields/DatePickerField";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { ReminderSettings } from "./ReminderSettings";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TaskTypeSelect } from "./form-fields/TaskTypeSelect";
import { PrioritySelect } from "./form-fields/PrioritySelect";
import { PropertySelect } from "./form-fields/PropertySelect";

interface TaskFormContentProps {
  title: string;
  setTitle: (value: string) => void;
  type: "regular" | "inspection" | "seasonal";
  setType: (value: "regular" | "inspection" | "seasonal") => void;
  priority: "low" | "medium" | "high" | "urgent";
  setPriority: (value: "low" | "medium" | "high" | "urgent") => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  recurrenceFrequency: "daily" | "weekly" | "monthly" | "yearly";
  setRecurrenceFrequency: (value: "daily" | "weekly" | "monthly" | "yearly") => void;
  recurrenceInterval: number;
  setRecurrenceInterval: (value: number) => void;
  hasReminder: boolean;
  setHasReminder: (value: boolean) => void;
  reminderDate: Date | undefined;
  setReminderDate: (date: Date | undefined) => void;
  reminderMethod: "app" | "email" | "both";
  setReminderMethod: (value: "app" | "email" | "both") => void;
  propertyId: string;
  setPropertyId: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const TaskFormContent = ({
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
}: TaskFormContentProps) => {
  const { t, language } = useLocale();
  const locale = language === "fr" ? fr : enUS;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t('taskTitle')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('enterTaskTitle')}
          required
        />
      </div>
      
      <PropertySelect 
        value={propertyId} 
        onChange={setPropertyId} 
        label={t('property')}
      />
      
      <TaskTypeSelect 
        value={type} 
        onChange={setType} 
        label={t('taskType')}
      />
      
      <PrioritySelect 
        value={priority} 
        onChange={setPriority} 
        label={t('priority')}
      />
      
      <DatePickerField 
        label={t('date')}
        date={date}
        onDateChange={setDate}
        locale={locale}
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
        dateLocale={locale}
      />
      
      <Button type="submit" className="w-full">
        {t('saveTask')}
      </Button>
    </form>
  );
};
