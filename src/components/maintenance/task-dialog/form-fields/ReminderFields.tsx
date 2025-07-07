
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CalendarIcon } from "lucide-react";

interface ReminderFieldsProps {
  hasReminder: boolean;
  setHasReminder: (hasReminder: boolean) => void;
  reminderDate: Date | undefined;
  setReminderDate: (date: Date | undefined) => void;
  reminderMethod: "app" | "email" | "both";
  setReminderMethod: (method: "app" | "email" | "both") => void;
}

export const ReminderFields = ({
  hasReminder,
  setHasReminder,
  reminderDate,
  setReminderDate,
  reminderMethod,
  setReminderMethod,
}: ReminderFieldsProps) => {
  const { t, language } = useLocale();

  const handleFocusAndScroll = (event: React.FocusEvent) => {
    const target = event.target as HTMLElement;
    setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }, 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="has-reminder"
          checked={hasReminder}
          onCheckedChange={setHasReminder}
          onFocus={handleFocusAndScroll}
        />
        <Label htmlFor="has-reminder">{t('setReminder')}</Label>
      </div>

      {hasReminder && (
        <div className="space-y-3 pl-6 border-l-2 border-gray-200">
          <div>
            <Label htmlFor="reminder-date" className="block text-sm font-medium mb-1">
              {t('reminderDate')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                  id="reminder-date"
                  onFocus={handleFocusAndScroll}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reminderDate ? (
                    format(reminderDate, "PPP", { locale: language === 'fr' ? fr : undefined })
                  ) : (
                    <span>{t('selectDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={reminderDate}
                  onSelect={setReminderDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="reminder-method" className="block text-sm font-medium mb-1">
              {t('reminderMethod')}
            </Label>
            <Select value={reminderMethod} onValueChange={(value: any) => setReminderMethod(value)}>
              <SelectTrigger id="reminder-method" onFocus={handleFocusAndScroll}>
                <SelectValue placeholder={t('selectMethod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">{t('reminderViaApp')}</SelectItem>
                <SelectItem value="email">{t('reminderViaEmail')}</SelectItem>
                <SelectItem value="both">{t('reminderViaBoth')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
