
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
      // Instead of simulating, we now pass the data back to the parent
      onSuccess({
        vendorId: selectedVendor,
        date: selectedDate,
        time,
        title,
        notes
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
  
  const resetForm = () => {
    setSelectedVendor("");
    setSelectedDate(new Date());
    setTime("");
    setTitle("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl">{t('scheduleAppointment')}</DialogTitle>
          <DialogDescription>
            {t('scheduleAppointmentDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 min-h-0 pr-4 pb-4">
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
          </form>
        </ScrollArea>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 mt-2 border-t">
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
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="sm:w-auto w-full"
          >
            {isSubmitting ? t('scheduling') : t('schedule')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
