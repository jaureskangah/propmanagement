
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface DashboardDateFilterProps {
  onDateRangeChange: (range: DateRange) => void;
}

export function DashboardDateFilter({ onDateRangeChange }: DashboardDateFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");
  const { t } = useLocale();

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    const now = new Date();
    let range: DateRange;

    switch (value) {
      case "this_month":
        range = {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
        };
        break;
      case "last_month":
        const lastMonth = subMonths(now, 1);
        range = {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
        };
        break;
      case "last_3_months":
        range = {
          startDate: startOfMonth(subMonths(now, 3)),
          endDate: endOfMonth(now),
        };
        break;
      case "last_6_months":
        range = {
          startDate: startOfMonth(subMonths(now, 6)),
          endDate: endOfMonth(now),
        };
        break;
      case "this_year":
        range = {
          startDate: startOfYear(now),
          endDate: endOfYear(now),
        };
        break;
      case "last_year":
        const lastYear = subYears(now, 1);
        range = {
          startDate: startOfYear(lastYear),
          endDate: endOfYear(lastYear),
        };
        break;
      default:
        range = {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
        };
    }

    onDateRangeChange(range);
  };

  return (
    <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={t('filterBy')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this_month">{t('thisMonth')}</SelectItem>
        <SelectItem value="last_month">{t('lastMonth')}</SelectItem>
        <SelectItem value="last_3_months">{t('last3Months')}</SelectItem>
        <SelectItem value="last_6_months">{t('last6Months')}</SelectItem>
        <SelectItem value="this_year">{t('thisYear')}</SelectItem>
        <SelectItem value="last_year">{t('lastYear')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
