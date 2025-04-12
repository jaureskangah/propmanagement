import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCw, CheckCircle, BellRing, Mail, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
  onCancel?: () => void;
  initialDate?: Date;
}

export const TaskForm = ({ onSubmit, onCancel, initialDate }: TaskFormProps) => {
  // Créer la date d'aujourd'hui sans composante temporelle pour éviter les problèmes de fuseau horaire
  const today = new Date();
  const defaultDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // Utiliser la date initiale si fournie, sinon la date d'aujourd'hui
  const [date, setDate] = useState<Date | undefined>(initialDate || defaultDate);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(initialDate || defaultDate);
  const [reminderMethod, setReminderMethod] = useState<"app" | "email" | "both">("app");
  
  const { t, language } = useLocale();
  
  const dateLocale = language === 'fr' ? fr : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && type) {
      // Créer une nouvelle date avec seulement année/mois/jour pour éviter les problèmes de fuseau horaire
      const submissionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const submissionReminderDate = reminderDate 
        ? new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate())
        : undefined;
      
      console.log("Submitting task with date:", submissionDate, "Original selected date:", date);
      console.log("Reminder date:", submissionReminderDate, "has reminder:", hasReminder, "method:", reminderMethod);
      
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

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Créer une nouvelle date avec seulement année/mois/jour
      const selectedDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      setDate(selectedDate);
    } else {
      setDate(undefined);
    }
  };

  const handleReminderDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Créer une nouvelle date avec seulement année/mois/jour
      const selectedDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      setReminderDate(selectedDate);
    } else {
      setReminderDate(undefined);
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
      
      {/* Nouvelle section pour les rappels */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="hasReminder" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            {t('addReminder')}
          </Label>
          <Switch
            id="hasReminder"
            checked={hasReminder}
            onCheckedChange={setHasReminder}
          />
        </div>
      </div>
      
      {hasReminder && (
        <div className="space-y-4 pt-2 pl-4 border-l-2 border-muted">
          <div className="space-y-2">
            <Label>{t('reminderDate')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !reminderDate && "text-muted-foreground"
                  )}
                >
                  <BellRing className="mr-2 h-4 w-4" />
                  {reminderDate ? format(reminderDate, "PPP", { locale: dateLocale }) : <span>{t('selectDate')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reminderDate}
                  onSelect={handleReminderDateSelect}
                  initialFocus
                  locale={dateLocale}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Nouvelle section pour la méthode de notification */}
          <div className="space-y-2">
            <Label>{t('reminderMethod')}</Label>
            <RadioGroup 
              value={reminderMethod} 
              onValueChange={(value: "app" | "email" | "both") => setReminderMethod(value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="app" id="app" />
                <Label htmlFor="app" className="flex items-center cursor-pointer">
                  <Smartphone className="h-4 w-4 mr-2" />
                  {t('reminderViaApp')}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center cursor-pointer">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('reminderViaEmail')}
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="flex items-center cursor-pointer">
                  <Smartphone className="h-4 w-4 mr-2" />
                  <Mail className="h-4 w-4 mr-2" />
                  {t('reminderViaBoth')}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
      
      <Separator className="my-2" />
      
      <Button type="submit" className="w-full">
        <CheckCircle className="h-4 w-4 mr-2" />
        {t('addTask')}
      </Button>
    </form>
  );
};
