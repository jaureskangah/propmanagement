import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { DollarSign, Calendar as CalendarIcon } from "lucide-react";

interface CostDateFieldsProps {
  cost: string;
  setCost: (value: string) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
}

export const CostDateFields = ({
  cost,
  setCost,
  date,
  setDate,
}: CostDateFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="cost">Estimated Cost ($)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="pl-10"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Scheduled Date</Label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            required
          />
        </div>
      </div>
    </div>
  );
};