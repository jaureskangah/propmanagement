
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/components/providers/LocaleProvider";

interface RecurrenceSelectProps {
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  recurrenceFrequency: "daily" | "weekly" | "monthly" | "yearly";
  setRecurrenceFrequency: (value: "daily" | "weekly" | "monthly" | "yearly") => void;
  recurrenceInterval: number;
  setRecurrenceInterval: (value: number) => void;
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
      <div className="flex items-center justify-between">
        <Label htmlFor="recurring" className="cursor-pointer">
          {t('recurringTask')}
        </Label>
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
      </div>

      {isRecurring && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recurrence-interval" className="block text-sm font-medium mb-1">
              {t('interval')}
            </Label>
            <Input
              id="recurrence-interval"
              type="number"
              min="1"
              value={recurrenceInterval}
              onChange={(e) => setRecurrenceInterval(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="recurrence-frequency" className="block text-sm font-medium mb-1">
              {t('frequency')}
            </Label>
            <Select
              value={recurrenceFrequency}
              onValueChange={(value: any) => setRecurrenceFrequency(value)}
            >
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
        </div>
      )}
    </div>
  );
};
