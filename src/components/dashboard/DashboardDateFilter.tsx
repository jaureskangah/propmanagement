
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
  const { t, language } = useLocale();

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

  // Debug pour voir les traductions
  console.log("Traductions filtre date:", {
    thisMonth: t('dashboard.thisMonth'),
    lastMonth: t('dashboard.lastMonth'),
    last3Months: t('dashboard.last3Months'),
    last6Months: t('dashboard.last6Months'),
    thisYear: t('dashboard.thisYear'),
    lastYear: t('dashboard.lastYear'),
    currentLanguage: language
  });

  return (
    <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={t('dashboard.filterBy')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this_month">{t('dashboard.thisMonth')}</SelectItem>
        <SelectItem value="last_month">{t('dashboard.lastMonth')}</SelectItem>
        <SelectItem value="last_3_months">{t('dashboard.last3Months')}</SelectItem>
        <SelectItem value="last_6_months">{t('dashboard.last6Months')}</SelectItem>
        <SelectItem value="this_year">{t('dashboard.thisYear')}</SelectItem>
        <SelectItem value="last_year">{t('dashboard.lastYear')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
