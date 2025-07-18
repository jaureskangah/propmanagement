
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (initialPropertyId && !propertyId) {
      setPropertyId(initialPropertyId);
    }
  }, [initialPropertyId, propertyId, setPropertyId]);

  // Fonction pour gérer le focus et le défilement automatique
  const handleFocusAndScroll = (event: React.FocusEvent) => {
    const target = event.target as HTMLElement;
    if (contentRef.current && target) {
      // Petit délai pour laisser le temps au focus de se positionner
      setTimeout(() => {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 100);
    }
  };

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
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto pr-3 scroll-smooth"
        style={{ maxHeight: 'calc(85vh - 140px)' }}
        onFocus={handleFocusAndScroll}
      >
        <div className="space-y-4 pb-8">
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
              onFocus={handleFocusAndScroll}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-type" className="block text-sm font-medium mb-1">
                {t('taskType')}
              </label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger id="task-type" onFocus={handleFocusAndScroll}>
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
                <SelectTrigger id="priority" onFocus={handleFocusAndScroll}>
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
                  onFocus={handleFocusAndScroll}
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
            onFocus={handleFocusAndScroll}
          />
          
          <div onFocus={handleFocusAndScroll}>
            <RecurrenceSelect 
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              recurrenceFrequency={recurrenceFrequency}
              setRecurrenceFrequency={setRecurrenceFrequency}
              recurrenceInterval={recurrenceInterval}
              setRecurrenceInterval={setRecurrenceInterval}
            />
          </div>
          
          <div onFocus={handleFocusAndScroll}>
            <ReminderFields 
              hasReminder={hasReminder}
              setHasReminder={setHasReminder}
              reminderDate={reminderDate}
              setReminderDate={setReminderDate}
              reminderMethod={reminderMethod}
              setReminderMethod={setReminderMethod}
            />
          </div>
          
          {/* Espacement supplémentaire en bas pour garantir l'accessibilité */}
          <div className="h-12" />
        </div>
      </div>

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
