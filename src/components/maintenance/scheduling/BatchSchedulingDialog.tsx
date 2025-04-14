
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewTask } from "../types";

interface BatchSchedulingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tasks: NewTask[]) => void;
  propertyId: string;
}

export const BatchSchedulingDialog = ({ isOpen, onClose, onSave, propertyId }: BatchSchedulingDialogProps) => {
  const { t } = useLocale();
  const [date, setDate] = useState<Date>(new Date());
  const [taskPrefix, setTaskPrefix] = useState("");
  const [taskCount, setTaskCount] = useState(1);
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");

  const handleSave = () => {
    const tasks: NewTask[] = [];
    for (let i = 0; i < taskCount; i++) {
      tasks.push({
        title: `${taskPrefix} ${i + 1}`,
        date: new Date(date),
        type,
        priority,
        is_recurring: false,
        property_id: propertyId
      });
    }
    onSave(tasks);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('batchCreateTasks')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskPrefix" className="text-right">
              {t('taskPrefix')}
            </Label>
            <Input
              id="taskPrefix"
              value={taskPrefix}
              onChange={(e) => setTaskPrefix(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskCount" className="text-right">
              {t('numberOfTasks')}
            </Label>
            <Input
              id="taskCount"
              type="number"
              min="1"
              max="20"
              value={taskCount}
              onChange={(e) => setTaskCount(parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              {t('date')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{t('selectDate')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              {t('type')}
            </Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">{t('regularTask')}</SelectItem>
                <SelectItem value="inspection">{t('inspection')}</SelectItem>
                <SelectItem value="seasonal">{t('seasonalTask')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              {t('priority')}
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger id="priority" className="col-span-3">
                <SelectValue placeholder={t('selectPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t('priorityLow')}</SelectItem>
                <SelectItem value="medium">{t('priorityMedium')}</SelectItem>
                <SelectItem value="high">{t('priorityHigh')}</SelectItem>
                <SelectItem value="urgent">{t('priorityUrgent')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
          <Button onClick={handleSave}>{t('create')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
