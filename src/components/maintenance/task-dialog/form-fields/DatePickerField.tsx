
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Locale } from "date-fns";

interface DatePickerFieldProps {
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  locale?: Locale;
  icon?: React.ReactNode;
}

export const DatePickerField = ({ 
  label, 
  date, 
  onDateChange, 
  locale,
  icon = <CalendarIcon className="mr-2 h-4 w-4" />
}: DatePickerFieldProps) => {
  const { t } = useLocale();
  
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Normalize the date (without hours/minutes/seconds)
      const selectedDate = startOfDay(newDate);
      console.log("Selected date in date picker:", format(selectedDate, "yyyy-MM-dd"));
      onDateChange(selectedDate);
    } else {
      onDateChange(undefined);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {icon}
            {date 
              ? format(date, "PPP", { locale }) 
              : <span>{t('selectDate')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={locale}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
