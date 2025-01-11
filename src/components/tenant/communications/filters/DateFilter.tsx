import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateFilter = ({ value, onChange }: DateFilterProps) => {
  // Format the displayed date in English format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    console.log("Date selected:", {
      rawValue: newDate,
      formattedValue: format(new Date(newDate), "yyyy-MM-dd")
    });
    onChange(newDate);
  };

  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="date"
        value={value}
        onChange={handleDateChange}
        className="pl-9"
        lang="en"
      />
    </div>
  );
};