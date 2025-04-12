
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BellRing, Smartphone, Mail } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePickerField } from "./form-fields/DatePickerField";

interface ReminderSettingsProps {
  hasReminder: boolean;
  setHasReminder: (value: boolean) => void;
  reminderDate: Date | undefined;
  setReminderDate: (date: Date | undefined) => void;
  reminderMethod: "app" | "email" | "both";
  setReminderMethod: (value: "app" | "email" | "both") => void;
  dateLocale?: Locale;
}

export const ReminderSettings = ({
  hasReminder,
  setHasReminder,
  reminderDate,
  setReminderDate,
  reminderMethod,
  setReminderMethod,
  dateLocale
}: ReminderSettingsProps) => {
  const { t } = useLocale();

  return (
    <>
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
          <DatePickerField 
            label={t('reminderDate')}
            date={reminderDate}
            onDateChange={setReminderDate}
            locale={dateLocale}
            icon={<BellRing className="mr-2 h-4 w-4" />}
          />
          
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
    </>
  );
};
