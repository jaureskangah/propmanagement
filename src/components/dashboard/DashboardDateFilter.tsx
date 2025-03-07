
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns";

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface DashboardDateFilterProps {
  onDateRangeChange: (range: DateRange) => void;
}

export function DashboardDateFilter({ onDateRangeChange }: DashboardDateFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");

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
        <SelectValue placeholder="Select a period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="this_month">This month</SelectItem>
        <SelectItem value="last_month">Last month</SelectItem>
        <SelectItem value="last_3_months">Last 3 months</SelectItem>
        <SelectItem value="last_6_months">Last 6 months</SelectItem>
        <SelectItem value="this_year">This year</SelectItem>
        <SelectItem value="last_year">Last year</SelectItem>
      </SelectContent>
    </Select>
  );
}
