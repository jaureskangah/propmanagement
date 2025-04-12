
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask } from "../types";

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
  initialDate?: Date;
  initialValue?: NewTask;
}

export const TaskForm = ({ onSubmit, initialDate, initialValue }: TaskFormProps) => {
  const { t, language } = useLocale();
  
  const [title, setTitle] = useState(initialValue?.title || "");
  const [type, setType] = useState<string>(initialValue?.type || "regular");
  const [priority, setPriority] = useState<string>(initialValue?.priority || "medium");
  const [date, setDate] = useState<Date | undefined>(initialValue?.date instanceof Date ? initialValue.date : initialDate || new Date());
  const [isRecurring, setIsRecurring] = useState(initialValue?.is_recurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState(initialValue?.recurrence_pattern?.frequency || "weekly");
  const [recurringInterval, setRecurringInterval] = useState(initialValue?.recurrence_pattern?.interval || 1);
  
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
      type: (type as "regular" | "inspection" | "seasonal"),
      priority: (priority as "low" | "medium" | "high" | "urgent"),
      date: date || new Date(),
      is_recurring: isRecurring,
      ...(isRecurring
        ? {
            recurrence_pattern: {
              frequency: recurringFrequency as "daily" | "weekly" | "monthly" | "yearly",
              interval: Number(recurringInterval),
              weekdays: [],
            },
          }
        : {}),
    };
    
    console.log("Submitting task with data:", newTask);
    onSubmit(newTask);
  };
  
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
      
      <div className="space-y-2">
        <Label>{t('date')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", {
                  locale: language === "fr" ? fr : enUS,
                })
              ) : (
                <span>{t('selectDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={language === "fr" ? fr : enUS}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            id="isRecurring"
            className="w-4 h-4"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <Label htmlFor="isRecurring">{t('isRecurring')}</Label>
        </div>
        
        {isRecurring && (
          <div className="ml-6 space-y-4 pt-2">
            <div className="space-y-2">
              <Label>{t('frequency')}</Label>
              <Select 
                value={recurringFrequency} 
                onValueChange={setRecurringFrequency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t('daily')}</SelectItem>
                  <SelectItem value="weekly">{t('weekly')}</SelectItem>
                  <SelectItem value="monthly">{t('monthly')}</SelectItem>
                  <SelectItem value="yearly">{t('yearly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{t('interval')}</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={recurringInterval}
                onChange={(e) => setRecurringInterval(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        )}
      </div>
      
      <Button type="submit" className="w-full">
        {t('saveTask')}
      </Button>
    </form>
  );
};
