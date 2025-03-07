
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

  return (
    <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={t('dashboard.filterBy')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this_month">{t('dashboard.thisMonth')}</SelectItem>
        <SelectItem value="last_month">{t('dashboard.lastMonth') || "Mois dernier"}</SelectItem>
        <SelectItem value="last_3_months">{t('dashboard.last3Months') || "3 derniers mois"}</SelectItem>
        <SelectItem value="last_6_months">{t('dashboard.last6Months') || "6 derniers mois"}</SelectItem>
        <SelectItem value="this_year">{t('dashboard.thisYear') || "Cette année"}</SelectItem>
        <SelectItem value="last_year">{t('dashboard.lastYear') || "Année dernière"}</SelectItem>
      </SelectContent>
    </Select>
  );
}
