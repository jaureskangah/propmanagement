import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { NewTask } from "../types";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BatchSchedulingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (tasks: NewTask[]) => void;
}

export const BatchSchedulingDialog = ({ isOpen, onClose, onSchedule }: BatchSchedulingDialogProps) => {
  const { t, language } = useLocale();
  const { toast } = useToast();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [batchTitle, setBatchTitle] = useState("");
  const [batchType, setBatchType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [batchPriority, setBatchPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dateLocale = language === 'fr' ? fr : undefined;
  
  const handleScheduleBatch = () => {
    if (!batchTitle || selectedDates.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const tasks: NewTask[] = selectedDates.map((date, index) => {
        const normalizedDate = new Date(Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          12, 0, 0, 0
        ));
        
        console.log(`Creating task ${index + 1} with date:`, normalizedDate, "Original selected date:", date);
        
        return {
          title: `${batchTitle} ${index + 1}`,
          date: normalizedDate,
          type: batchType,
          priority: batchPriority,
          is_recurring: false
        };
      });
      
      onSchedule(tasks);
      resetForm();
      
      toast({
        title: t('success'),
        description: t('multipleTasksAdded'),
      });
    } catch (error) {
      console.error("Error scheduling tasks:", error);
      toast({
        title: t('error'),
        description: t('errorAddingTasks'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setBatchTitle("");
    setSelectedDates([]);
    setBatchType("regular");
    setBatchPriority("medium");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (dates) {
      setSelectedDates(dates.map(date => {
        return new Date(Date.UTC(
          date.getFullYear(), 
          date.getMonth(), 
          date.getDate(),
          12, 0, 0, 0
        ));
      }));
    } else {
      setSelectedDates([]);
    }
  };
  
  const removeDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter(
      date => date.getTime() !== dateToRemove.getTime()
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t('batchScheduling')}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-130px)] px-6">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batchTitle">{t('batchTitle')}</Label>
              <Input
                id="batchTitle"
                value={batchTitle}
                onChange={(e) => setBatchTitle(e.target.value)}
                placeholder={t('batchTitlePlaceholder')}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchType">{t('taskType')}</Label>
                <Select value={batchType} onValueChange={(value: any) => setBatchType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">{t('regularTask')}</SelectItem>
                    <SelectItem value="inspection">{t('inspection')}</SelectItem>
                    <SelectItem value="seasonal">{t('seasonalTask')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>{t('priority')}</Label>
                <Select value={batchPriority} onValueChange={(value: any) => setBatchPriority(value)}>
                  <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label>{t('selectDates')}</Label>
              <div className="border rounded-md p-4">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={handleDateSelect}
                  className="pointer-events-auto w-full"
                  locale={dateLocale}
                  initialFocus
                />
              </div>
            </div>
            
            {selectedDates.length > 0 && (
              <div className="space-y-2">
                <Label>{t('selectedDates')}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedDates.map((date, i) => (
                    <Card key={i} className="w-full">
                      <CardContent className="p-2 flex justify-between items-center">
                        <span className="text-sm">{format(date, 'PP', { locale: dateLocale })}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => removeDate(date)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleScheduleBatch}
            disabled={!batchTitle || selectedDates.length === 0 || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              t('schedulingTasks')
            ) : (
              <>
                <CalendarCheck2 className="h-4 w-4" />
                {t('scheduleTasks')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
