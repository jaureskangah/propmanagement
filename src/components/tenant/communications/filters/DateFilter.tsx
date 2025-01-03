import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateFilter = ({ value, onChange }: DateFilterProps) => {
  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};