
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "./form-fields/DatePickerField";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TaskTypeSelect } from "./form-fields/TaskTypeSelect";
import { PrioritySelect } from "./form-fields/PrioritySelect";

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
      
      <TaskTypeSelect 
        value={type} 
        onChange={setType} 
        label={t('taskType')}
      />
      
      <PrioritySelect 
        value={priority} 
        onChange={setPriority} 
        label={t('taskPriority')}
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
      
      <Button type="submit" className="w-full">
        {t('saveTask')}
      </Button>
    </form>
  );
};
