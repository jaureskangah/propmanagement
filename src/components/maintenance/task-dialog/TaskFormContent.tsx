
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { DatePickerField } from "./form-fields/DatePickerField";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

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
      
      <div className="space-y-2">
        <Label>{t('taskType')}</Label>
        <RadioGroup 
          value={type} 
          onValueChange={setType}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="regular" id="regular" />
            <Label htmlFor="regular">{t('regular')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inspection" id="inspection" />
            <Label htmlFor="inspection">{t('inspection')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="seasonal" id="seasonal" />
            <Label htmlFor="seasonal">{t('seasonal')}</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>{t('taskPriority')}</Label>
        <Select 
          value={priority} 
          onValueChange={setPriority}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('selectPriority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{t('low')}</SelectItem>
            <SelectItem value="medium">{t('medium')}</SelectItem>
            <SelectItem value="high">{t('high')}</SelectItem>
            <SelectItem value="urgent">{t('urgent')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
