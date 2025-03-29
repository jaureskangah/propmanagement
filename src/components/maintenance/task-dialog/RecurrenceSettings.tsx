
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCw } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface RecurrenceSettingsProps {
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  recurrenceFrequency: "daily" | "weekly" | "monthly";
  setRecurrenceFrequency: (value: "daily" | "weekly" | "monthly") => void;
  recurrenceInterval: number;
  setRecurrenceInterval: (value: number) => void;
}

export const RecurrenceSettings = ({
  isRecurring,
  setIsRecurring,
  recurrenceFrequency,
  setRecurrenceFrequency,
  recurrenceInterval,
  setRecurrenceInterval
}: RecurrenceSettingsProps) => {
  const { t } = useLocale();

  return (
    <>
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="isRecurring" className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            {t('makeRecurring')}
          </Label>
          <Switch
            id="isRecurring"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
          />
        </div>
      </div>
      
      {isRecurring && (
        <div className="space-y-4 pt-2 pl-4 border-l-2 border-muted">
          <div className="space-y-2">
            <Label>{t('recurrenceFrequency')}</Label>
            <Select 
              value={recurrenceFrequency} 
              onValueChange={(value: "daily" | "weekly" | "monthly") => setRecurrenceFrequency(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t('daily')}</SelectItem>
                <SelectItem value="weekly">{t('weekly')}</SelectItem>
                <SelectItem value="monthly">{t('monthly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t('recurrenceInterval')}</Label>
            <div className="flex items-center gap-2">
              <Label>{t('every')}</Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <Label>
                {recurrenceFrequency === "daily" && (recurrenceInterval > 1 ? t('days') : t('day'))}
                {recurrenceFrequency === "weekly" && (recurrenceInterval > 1 ? t('weeks') : t('week'))}
                {recurrenceFrequency === "monthly" && (recurrenceInterval > 1 ? t('months') : t('month'))}
              </Label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
