
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface YearFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearFilter({ selectedYear, onYearChange }: YearFilterProps) {
  const { t } = useLocale();
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  useEffect(() => {
    // Generate a list of years from 3 years ago to current year
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 3; i <= currentYear; i++) {
      years.push(i);
    }
    setAvailableYears(years);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
        <CalendarIcon className="h-4 w-4 text-primary" />
      </div>
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => onYearChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder={t('selectYear', { fallback: 'Select Year' })} />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
