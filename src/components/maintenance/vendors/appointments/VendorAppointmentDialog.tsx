
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Vendor } from "@/types/vendor";
import { fr, enUS } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Appointment {
  id: string;
  vendorId: string;
  date: Date;
  time: string;
  title: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  sendEmail?: boolean;
  setReminder?: boolean;
  reminderTime?: string;
  reminderSent?: boolean;
}

interface VendorAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendors: Vendor[];
  appointment: Appointment | null;
  onSuccess: (appointmentData: {
    vendorId: string;
    date: Date;
    time: string;
    title: string;
    notes?: string;
    sendEmail: boolean;
    setReminder: boolean;
    reminderTime: string;
  }) => void;
}

export const VendorAppointmentDialog = ({
  open,
  onOpenChange,
  vendors,
  appointment,
  onSuccess
}: VendorAppointmentDialogProps) => {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const [setReminder, setSetReminder] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>("1day");
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Fill the form with the appointment data if editing
  useEffect(() => {
    if (appointment) {
      setSelectedVendor(appointment.vendorId);
      setSelectedDate(appointment.date);
      setTime(appointment.time);
      setTitle(appointment.title);
      setNotes(appointment.notes || "");
      setSendEmail(appointment.sendEmail || true);
      setSetReminder(appointment.setReminder || false);
      setReminderTime(appointment.reminderTime || "1day");
    } else {
      resetForm();
    }
  }, [appointment, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVendor || !selectedDate || !time || !title) {
      toast({
        title: t('validationError'),
        description: t('pleaseCompleteAllFields'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Pass the data back to the parent component
      onSuccess({
        vendorId: selectedVendor,
        date: selectedDate,
        time,
        title,
        notes,
        sendEmail,
        setReminder,
        reminderTime
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error);
      toast({
        title: t('error'),
        description: t('errorSchedulingAppointment'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setSelectedVendor("");
    setSelectedDate(new Date());
    setTime("");
    setTitle("");
    setNotes("");
    setSendEmail(true);
    setSetReminder(false);
    setReminderTime("1day");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-auto max-h-[90vh]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl">
            {appointment ? t('editAppointment') : t('scheduleAppointment')}
          </DialogTitle>
          <DialogDescription>
            {appointment ? t('editAppointmentDescription') : t('scheduleAppointmentDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="vendor" className="text-sm font-medium">{t('vendor')}</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger id="vendor" className="w-full">
                <SelectValue placeholder={t('selectVendor')} />
              </SelectTrigger>
              <SelectContent>
                {vendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.specialty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('date')}</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: locale === 'fr' ? fr : enUS })
                    ) : (
                      <span>{t('pickDate')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    locale={locale === 'fr' ? fr : enUS}
                    className="pointer-events-auto p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">{t('time')}</Label>
              <div className="relative">
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10"
                />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">{t('appointmentTitle')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('appointmentTitlePlaceholder')}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">{t('notes')}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('appointmentNotesPlaceholder', { fallback: t('notesPlaceholder') })}
              rows={3}
              className="w-full resize-none"
            />
          </div>
          
          <div className="space-y-4 pt-2 border-t">
            <h3 className="text-sm font-medium">{t('notifications')}</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notification" className="text-sm">{t('sendEmailToVendor')}</Label>
                <p className="text-xs text-muted-foreground">{t('sendEmailToVendorDescription')}</p>
              </div>
              <Switch
                id="email-notification"
                checked={sendEmail}
                onCheckedChange={setSendEmail}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="set-reminder" className="text-sm">{t('setReminder')}</Label>
                <p className="text-xs text-muted-foreground">{t('setReminderDescription')}</p>
              </div>
              <Switch
                id="set-reminder"
                checked={setReminder}
                onCheckedChange={setSetReminder}
              />
            </div>
            
            {setReminder && (
              <div className="space-y-2 pl-4 border-l-2 border-muted-foreground/20">
                <Label htmlFor="reminder-time" className="text-sm">{t('reminderTime')}</Label>
                <Select value={reminderTime} onValueChange={setReminderTime}>
                  <SelectTrigger id="reminder-time" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">{t('oneHourBefore')}</SelectItem>
                    <SelectItem value="3hours">{t('threeHoursBefore')}</SelectItem>
                    <SelectItem value="1day">{t('oneDayBefore')}</SelectItem>
                    <SelectItem value="2days">{t('twoDaysBefore')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="sm:w-auto w-full"
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="sm:w-auto w-full"
            >
              {isSubmitting ? t('saving') : (appointment ? t('update') : t('schedule'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
