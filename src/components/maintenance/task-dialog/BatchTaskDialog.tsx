
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewTask } from "../types";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CalendarIcon, Loader2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { PropertySelect } from "./form-fields/PropertySelect";

interface BatchTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: NewTask[]) => Promise<any>;
  onSuccess: (count: number) => void;
  initialPropertyId?: string;
}

export const BatchTaskDialog = ({
  isOpen,
  onClose,
  onAddTasks,
  onSuccess,
  initialPropertyId
}: BatchTaskDialogProps) => {
  const { t } = useLocale();
  const [batchTitle, setBatchTitle] = useState("");
  const [taskType, setTaskType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyId, setPropertyId] = useState(initialPropertyId || '');
  
  const handleSelectDate = (date: Date) => {
    // Check if the date is already selected
    const dateExists = selectedDates.find(
      (d) => d.toDateString() === date.toDateString()
    );
    
    if (dateExists) {
      // If it exists, remove it (toggle)
      setSelectedDates(
        selectedDates.filter((d) => d.toDateString() !== date.toDateString())
      );
    } else {
      // If it doesn't exist, add it
      setSelectedDates([...selectedDates, date]);
    }
  };
  
  const handleRemoveDate = (dateToRemove: Date) => {
    setSelectedDates(
      selectedDates.filter((d) => d.toDateString() !== dateToRemove.toDateString())
    );
  };
  
  const handleSubmit = async () => {
    if (batchTitle.trim() === "") {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Créer une tâche pour chaque date sélectionnée
      const tasks: NewTask[] = selectedDates.map((date, index) => ({
        title: selectedDates.length > 1 ? `${batchTitle} (${index + 1})` : batchTitle,
        type: taskType,
        priority,
        date,
        property_id: propertyId || undefined
      }));
      
      await onAddTasks(tasks);
      onSuccess(tasks.length);
      
      // Reset form
      setBatchTitle("");
      setTaskType("regular");
      setPriority("medium");
      setSelectedDates([]);
    } catch (error) {
      console.error("Error adding batch tasks:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('batchScheduling')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="batch-title">{t('batchTitle')}</Label>
            <Input
              id="batch-title"
              placeholder={t('batchTitlePlaceholder')}
              value={batchTitle}
              onChange={(e) => setBatchTitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-type">{t('taskType')}</Label>
              <Select value={taskType} onValueChange={(value: any) => setTaskType(value)}>
                <SelectTrigger id="task-type">
                  <SelectValue placeholder={t('selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">{t('regularTask')}</SelectItem>
                  <SelectItem value="inspection">{t('inspection')}</SelectItem>
                  <SelectItem value="seasonal">{t('seasonalTask')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">{t('priority')}</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder={t('selectPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('low')}</SelectItem>
                  <SelectItem value="medium">{t('medium')}</SelectItem>
                  <SelectItem value="high">{t('high')}</SelectItem>
                  <SelectItem value="urgent">{t('urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <PropertySelect
            value={propertyId}
            onChange={setPropertyId}
            label={t('property')}
          />
          
          <div>
            <Label>{t('selectDates')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDates.length > 0
                    ? `${selectedDates.length} ${t('datesSelected')}`
                    : t('selectDatesCalendar')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {selectedDates.length > 0 && (
            <div>
              <Label>{t('selectedDates')}</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedDates
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date) => (
                    <div
                      key={date.toString()}
                      className="flex items-center bg-muted text-xs px-2 py-1 rounded"
                    >
                      {format(date, "dd/MM/yyyy")}
                      <XCircle
                        className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveDate(date)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || batchTitle.trim() === "" || selectedDates.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('schedulingTasks')}
              </>
            ) : (
              t('scheduleTasks')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
