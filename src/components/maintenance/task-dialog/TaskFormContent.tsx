
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CalendarIcon, Loader2 } from "lucide-react";
import { RecurrenceSelect } from "./form-fields/RecurrenceSelect";
import { PropertySelect } from "./form-fields/PropertySelect";
import { ReminderFields } from "./form-fields/ReminderFields";

interface TaskFormContentProps {
  title: string;
  setTitle: (title: string) => void;
  type: "regular" | "inspection" | "seasonal";
  setType: (type: "regular" | "inspection" | "seasonal") => void;
  priority: "low" | "medium" | "high" | "urgent";
  setPriority: (priority: "low" | "medium" | "high" | "urgent") => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  isRecurring: boolean;
  setIsRecurring: (isRecurring: boolean) => void;
  recurrenceFrequency: "daily" | "weekly" | "monthly" | "yearly";
  setRecurrenceFrequency: (frequency: "daily" | "weekly" | "monthly" | "yearly") => void;
  recurrenceInterval: number;
  setRecurrenceInterval: (interval: number) => void;
  hasReminder: boolean;
  setHasReminder: (hasReminder: boolean) => void;
  reminderDate: Date | undefined;
  setReminderDate: (date: Date | undefined) => void;
  reminderMethod: "app" | "email" | "both";
  setReminderMethod: (method: "app" | "email" | "both") => void;
  propertyId: string;
  setPropertyId: (propertyId: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  initialPropertyId?: string;
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
  handleSubmit,
  initialPropertyId
}: TaskFormContentProps) => {
  const { t, language } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialPropertyId && !propertyId) {
      setPropertyId(initialPropertyId);
    }
  }, [initialPropertyId, propertyId, setPropertyId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await handleSubmit(e);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-3" style={{ maxHeight: 'calc(85vh - 160px)' }}>
        <div className="space-y-4 pb-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              {t('taskTitle')}
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('enterTaskTitle')}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-type" className="block text-sm font-medium mb-1">
                {t('taskType')}
              </label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger id="task-type">
                  <SelectValue placeholder={t('selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">{t('regularTask')}</SelectItem>
                  <SelectItem value="inspection">{t('inspection')}</SelectItem>
                  <SelectItem value="seasonal">{t('seasonalTask')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                {t('priority')}
              </label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority">
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
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              {t('date')}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                  id="date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: language === 'fr' ? fr : undefined })
                  ) : (
                    <span>{t('selectDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <PropertySelect
            value={propertyId}
            onChange={setPropertyId}
            label={t('property')}
          />
          
          <RecurrenceSelect 
            isRecurring={isRecurring}
            setIsRecurring={setIsRecurring}
            recurrenceFrequency={recurrenceFrequency}
            setRecurrenceFrequency={setRecurrenceFrequency}
            recurrenceInterval={recurrenceInterval}
            setRecurrenceInterval={setRecurrenceInterval}
          />
          
          <ReminderFields 
            hasReminder={hasReminder}
            setHasReminder={setHasReminder}
            reminderDate={reminderDate}
            setReminderDate={setReminderDate}
            reminderMethod={reminderMethod}
            setReminderMethod={setReminderMethod}
          />
          
          {/* Extra spacing at the bottom to ensure content is not cut off */}
          <div className="h-4" />
        </div>
      </ScrollArea>

      <div className="flex-shrink-0 mt-4 pt-4 border-t bg-background">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('saving')}
            </>
          ) : (
            t('saveTask')
          )}
        </Button>
      </div>
    </form>
  );
};
