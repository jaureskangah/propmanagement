
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
