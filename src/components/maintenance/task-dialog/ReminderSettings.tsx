
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BellRing, Calendar } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";

interface ReminderSettingsProps {
  isReminderEnabled: boolean;
  setIsReminderEnabled: (value: boolean) => void;
  reminderTime: string;
  setReminderTime: (value: string) => void;
  reminderDate: Date | undefined;
  setReminderDate: (value: Date | undefined) => void;
  notificationType: "email" | "app" | "both";
  setNotificationType: (value: "email" | "app" | "both") => void;
  taskDate: Date | undefined;
}

export const ReminderSettings = ({
  isReminderEnabled,
  setIsReminderEnabled,
  reminderTime,
  setReminderTime,
  reminderDate,
  setReminderDate,
  notificationType,
  setNotificationType,
  taskDate
}: ReminderSettingsProps) => {
  const { t, language } = useLocale();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  const [isCustomDate, setIsCustomDate] = useState(false);
  
  // Utiliser la date de la tâche par défaut si aucune date spécifique n'est définie
  const handleDateTypeChange = (value: string) => {
    if (value === 'task') {
      setIsCustomDate(false);
      setReminderDate(taskDate);
    } else {
      setIsCustomDate(true);
    }
  };
  
  // Options prédéfinies pour le rappel
  const handleQuickDate = (option: string) => {
    const today = new Date();
    
    switch (option) {
      case 'today':
        setReminderDate(today);
        break;
      case 'tomorrow':
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        setReminderDate(tomorrow);
        break;
      case 'next-week':
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        setReminderDate(nextWeek);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="isReminderEnabled" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            {t('enableReminder')}
          </Label>
          <Switch
            id="isReminderEnabled"
            checked={isReminderEnabled}
            onCheckedChange={setIsReminderEnabled}
          />
        </div>
      </div>
      
      {isReminderEnabled && (
        <div className="space-y-4 pt-2 pl-4 border-l-2 border-muted">
          <div className="space-y-2">
            <Label>{t('reminderDate')}</Label>
            
            <RadioGroup defaultValue="task" className="flex flex-col space-y-1" onValueChange={handleDateTypeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="task" id="task-date" />
                <Label htmlFor="task-date">{t('sameAsTaskDate')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom-date" />
                <Label htmlFor="custom-date">{t('customDate')}</Label>
              </div>
            </RadioGroup>
            
            {isCustomDate && (
              <div className="pt-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleQuickDate('today')}
                  >
                    {t('today')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleQuickDate('tomorrow')}
                  >
                    {t('tomorrow')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleQuickDate('next-week')}
                  >
                    {t('nextWeek')}
                  </Button>
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !reminderDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {reminderDate ? format(reminderDate, "PPP", { locale: dateLocale }) : <span>{t('selectDate')}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={reminderDate}
                      onSelect={setReminderDate}
                      initialFocus
                      locale={dateLocale}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>{t('reminderTime')}</Label>
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('notificationType')}</Label>
            <Select 
              value={notificationType} 
              onValueChange={(value: "email" | "app" | "both") => setNotificationType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">{t('emailNotification')}</SelectItem>
                <SelectItem value="app">{t('appNotification')}</SelectItem>
                <SelectItem value="both">{t('bothNotifications')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  );
};
