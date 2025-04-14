
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ReminderFieldsProps {
  hasReminder: boolean;
  setHasReminder: (value: boolean) => void;
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="reminder" className="cursor-pointer">
          {t('setReminder')}
        </Label>
        <Switch
          id="reminder"
          checked={hasReminder}
          onCheckedChange={setHasReminder}
        />
      </div>

      {hasReminder && (
        <div className="space-y-4">
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
            <Select
              value={reminderMethod}
              onValueChange={(value: any) => setReminderMethod(value)}
            >
              <SelectTrigger id="reminder-method">
                <SelectValue placeholder={t('selectMethod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">{t('inApp')}</SelectItem>
                <SelectItem value="email">{t('email')}</SelectItem>
                <SelectItem value="both">{t('both')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
