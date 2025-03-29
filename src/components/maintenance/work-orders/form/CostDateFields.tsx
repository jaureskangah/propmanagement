
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="border-blue-100">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cost" className="flex items-center text-base font-medium">
              <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
              Coût estimé (€)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-base font-medium">
              <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
              Date prévue
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left border-gray-300 focus:ring-blue-500 focus:border-blue-500",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {date ? format(date, 'dd MMMM yyyy', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
