
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Plus, CalendarIcon, RotateCw, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/components/providers/LocaleProvider";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { NewTask } from "./types";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface AddTaskDialogProps {
  onAddTask: (task: NewTask) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AddTaskDialog = ({ onAddTask, isOpen, onClose }: AddTaskDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">("regular");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  
  const { t, language } = useLocale();
  
  // Déterminer la locale pour date-fns
  const dateLocale = language === 'fr' ? fr : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && type) {
      onAddTask({ 
        title,
        date,
        type,
        priority,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? {
          frequency: recurrenceFrequency,
          interval: recurrenceInterval,
          weekdays: [],
          end_date: undefined
        } : undefined
      });
      if (onClose) {
        onClose();
      } else {
        setInternalOpen(false);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDate(new Date());
    setType("regular");
    setPriority("medium");
    setIsRecurring(false);
    setRecurrenceFrequency("weekly");
    setRecurrenceInterval(1);
  };

  // Determine if we're using controlled or uncontrolled open state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onClose ? (value: boolean) => {
    if (!value) {
      resetForm();
      onClose();
    }
  } : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* IMPORTANT: On supprime complètement le DialogTrigger qui ajoute le bouton + Ajouter 
          lorsque ce composant est utilisé en mode contrôlé (avec isOpen) */}
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t('addNewTask')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('taskTitle')}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('taskTitle')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('date')}</Label>
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
                    {date ? format(date, "PPP", { locale: dateLocale }) : <span>{t('selectDate')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={dateLocale}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>{t('priority')}</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high" | "urgent") => setPriority(value)}>
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
            
            <div className="space-y-2">
              <Label>{t('taskType')}</Label>
              <Select value={type} onValueChange={(value: "regular" | "inspection" | "seasonal") => setType(value)}>
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
            
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="isRecurring" className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  {t('makeRecurring')}
                </Label>
                <Switch
                  id="isRecurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>
            </div>
            
            {isRecurring && (
              <div className="space-y-4 pt-2 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label>{t('recurrenceFrequency')}</Label>
                  <Select 
                    value={recurrenceFrequency} 
                    onValueChange={(value: "daily" | "weekly" | "monthly") => setRecurrenceFrequency(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t('daily')}</SelectItem>
                      <SelectItem value="weekly">{t('weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('monthly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>{t('recurrenceInterval')}</Label>
                  <div className="flex items-center gap-2">
                    <Label>{t('every')}</Label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={recurrenceInterval}
                      onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    <Label>
                      {recurrenceFrequency === "daily" && (recurrenceInterval > 1 ? t('days') : t('day'))}
                      {recurrenceFrequency === "weekly" && (recurrenceInterval > 1 ? t('weeks') : t('week'))}
                      {recurrenceFrequency === "monthly" && (recurrenceInterval > 1 ? t('months') : t('month'))}
                    </Label>
                  </div>
                </div>
              </div>
            )}
            
            <Separator className="my-2" />
            
            <Button type="submit" className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('addTask')}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
