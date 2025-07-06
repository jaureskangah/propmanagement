
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/providers/LocaleProvider";

interface RecurrenceSelectProps {
  isRecurring: boolean;
  setIsRecurring: (isRecurring: boolean) => void;
  recurrenceFrequency: "daily" | "weekly" | "monthly" | "yearly";
  setRecurrenceFrequency: (frequency: "daily" | "weekly" | "monthly" | "yearly") => void;
  recurrenceInterval: number;
  setRecurrenceInterval: (interval: number) => void;
}

export const RecurrenceSelect = ({
  isRecurring,
  setIsRecurring,
  recurrenceFrequency,
  setRecurrenceFrequency,
  recurrenceInterval,
  setRecurrenceInterval,
}: RecurrenceSelectProps) => {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="is-recurring"
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
        <Label htmlFor="is-recurring">{t('makeRecurring')}</Label>
      </div>

      {isRecurring && (
        <div className="space-y-4 pl-6 border-l-2 border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recurrence-frequency" className="block text-sm font-medium mb-1">
                {t('recurrenceFrequency')}
              </Label>
              <Select value={recurrenceFrequency} onValueChange={(value: any) => setRecurrenceFrequency(value)}>
                <SelectTrigger id="recurrence-frequency">
                  <SelectValue placeholder={t('selectFrequency')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t('daily')}</SelectItem>
                  <SelectItem value="weekly">{t('weekly')}</SelectItem>
                  <SelectItem value="monthly">{t('monthly')}</SelectItem>
                  <SelectItem value="yearly">{t('yearly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recurrence-interval" className="block text-sm font-medium mb-1">
                {t('recurrenceInterval')}
              </Label>
              <Input
                id="recurrence-interval"
                type="number"
                min={1}
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
