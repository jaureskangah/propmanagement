
import React, { useState } from "react";
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
import { addDays, subHours } from "date-fns";
import { supabase } from "@/lib/supabase";

interface VendorAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendors: Vendor[];
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
      // If email notifications are enabled, send email to vendor
      if (sendEmail) {
        const vendor = vendors.find(v => v.id === selectedVendor);
        if (vendor) {
          await sendEmailToVendor(vendor, {
            date: selectedDate,
            time,
            title,
            notes
          });
        }
      }
      
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
      
      resetForm();
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
  
  const sendEmailToVendor = async (vendor: Vendor, appointmentDetails: { 
    date: Date; 
    time: string; 
    title: string; 
    notes?: string 
  }) => {
    try {
      const formattedDate = appointmentDetails.date.toLocaleDateString(
        locale === 'fr' ? 'fr-FR' : 'en-US', 
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      );
      
      const emailContent = `
        ${t('appointmentScheduled')}
        
        ${t('date')}: ${formattedDate}
        ${t('time')}: ${appointmentDetails.time}
        ${t('appointmentTitle')}: ${appointmentDetails.title}
        ${appointmentDetails.notes ? `${t('notes')}: ${appointmentDetails.notes}` : ''}
      `;
      
      const { error } = await supabase.functions.invoke('send-vendor-email', {
        body: {
          vendorEmail: vendor.email,
          vendorName: vendor.name,
          subject: `${t('appointmentScheduled')}: ${appointmentDetails.title}`,
          content: emailContent
        }
      });
      
      if (error) throw error;
      
      toast({
        title: t('success'),
        description: t('emailSentToVendor')
      });
    } catch (error) {
      console.error("Error sending email to vendor:", error);
      toast({
        description: t('errorSendingEmail'),
        variant: "destructive"
      });
      // We don't throw here to allow the appointment to be created even if email sending fails
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
          <DialogTitle className="text-xl">{t('scheduleAppointment')}</DialogTitle>
          <DialogDescription>
            {t('scheduleAppointmentDescription')}
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
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('date')}</Label>
            <div className="border rounded-md p-3 bg-background">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={locale === 'fr' ? fr : enUS}
                className="mx-auto"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">{t('time')}</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
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
              placeholder={t('notesPlaceholder')}
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
              <div className="space-y-2 pl-2 border-l-2 border-muted-foreground/20">
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
              {isSubmitting ? t('scheduling') : t('schedule')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
