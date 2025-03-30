
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCw, CheckCircle, BellRing } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { ReminderSettings } from "./ReminderSettings";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskFormProps {
  onSubmit: (task: NewTask) => void;
  onCancel?: () => void;
}

export const TaskForm = ({ onSubmit, onCancel }: TaskFormProps) => {
  // Créer la date d'aujourd'hui sans composante temporelle pour éviter les problèmes de fuseau horaire
  const today = new Date();
  const initialDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  
  // États pour les paramètres de récurrence
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  
  // États pour les paramètres de rappel
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderDate, setReminderDate] = useState<Date | undefined>(initialDate);
  const [notificationType, setNotificationType] = useState<"email" | "app" | "both">("app");
  
  const { t, language } = useLocale();
  
  const dateLocale = language === 'fr' ? fr : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && type) {
      // Créer une nouvelle date avec seulement année/mois/jour pour éviter les problèmes de fuseau horaire
      const submissionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      console.log("Submitting task with date:", submissionDate, "Original selected date:", date);
      
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
        } : undefined
      };
      
      // Ajouter les informations de rappel si activé
      if (isReminderEnabled) {
        newTask.reminder = {
          enabled: true,
          time: reminderTime,
          date: reminderDate,
          notification_type: notificationType
        };
      }
      
      onSubmit(newTask);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Créer une nouvelle date avec seulement année/mois/jour
      const selectedDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      setDate(selectedDate);
      
      // Si le rappel utilise la même date que la tâche, mettre à jour aussi
      if (!isReminderEnabled || reminderDate === date) {
        setReminderDate(selectedDate);
      }
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
      
      <Tabs defaultValue="recurrence" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="recurrence" className="flex items-center gap-1">
            <RotateCw className="h-4 w-4" />
            {t('recurringTasks')}
          </TabsTrigger>
          <TabsTrigger value="reminder" className="flex items-center gap-1">
            <BellRing className="h-4 w-4" />
            {t('reminders')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recurrence" className="pt-2">
          <RecurrenceSettings 
            isRecurring={isRecurring}
            setIsRecurring={setIsRecurring}
            recurrenceFrequency={recurrenceFrequency}
            setRecurrenceFrequency={setRecurrenceFrequency}
            recurrenceInterval={recurrenceInterval}
            setRecurrenceInterval={setRecurrenceInterval}
          />
        </TabsContent>
        
        <TabsContent value="reminder" className="pt-2">
          <ReminderSettings 
            isReminderEnabled={isReminderEnabled}
            setIsReminderEnabled={setIsReminderEnabled}
            reminderTime={reminderTime}
            setReminderTime={setReminderTime}
            reminderDate={reminderDate}
            setReminderDate={setReminderDate}
            notificationType={notificationType}
            setNotificationType={setNotificationType}
            taskDate={date}
          />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-2" />
      
      <Button type="submit" className="w-full">
        <CheckCircle className="h-4 w-4 mr-2" />
        {t('addTask')}
      </Button>
    </form>
  );
};
