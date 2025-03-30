import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCw, CheckCircle } from "lucide-react";
import { format, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { Separator } from "@/components/ui/separator";

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
  onCancel?: () => void;
}

export const TaskForm = ({ onSubmit, onCancel }: TaskFormProps) => {
  const today = new Date();
  const utcToday = new Date(Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    12, 0, 0, 0
  ));
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(utcToday);
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  
  const { t, language } = useLocale();
  
  const dateLocale = language === 'fr' ? fr : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && type) {
      const normalizedDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12, 0, 0, 0
      ));
      
      console.log("Submitting task with date:", normalizedDate, "Original date:", date);
      
      onSubmit({ 
        title,
        date: normalizedDate,
        type,
        priority,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? {
          frequency: recurrenceFrequency,
          interval: recurrenceInterval,
          weekdays: [],
          end_date: undefined
        } : undefined
      });
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const normalizedDate = new Date(Date.UTC(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        12, 0, 0, 0
      ));
      setDate(normalizedDate);
    } else {
      setDate(undefined);
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
      
      <div className="space-y-2">
        <Label>{t('date')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: dateLocale }) : <span>{t('selectDate')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              locale={dateLocale}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>{t('priority')}</Label>
        <Select value={priority} onValueChange={(value: "low" | "medium" | "high" | "urgent") => setPriority(value)}>
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
      
      <div className="space-y-2">
        <Label>{t('taskType')}</Label>
        <Select value={type} onValueChange={(value: "regular" | "inspection" | "seasonal") => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('selectType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">{t('regularTask')}</SelectItem>
            <SelectItem value="inspection">{t('inspection')}</SelectItem>
            <SelectItem value="seasonal">{t('seasonalTask')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <RecurrenceSettings 
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        recurrenceFrequency={recurrenceFrequency}
        setRecurrenceFrequency={setRecurrenceFrequency}
        recurrenceInterval={recurrenceInterval}
        setRecurrenceInterval={setRecurrenceInterval}
      />
      
      <Separator className="my-2" />
      
      <Button type="submit" className="w-full">
        <CheckCircle className="h-4 w-4 mr-2" />
        {t('addTask')}
      </Button>
    </form>
  );
};
