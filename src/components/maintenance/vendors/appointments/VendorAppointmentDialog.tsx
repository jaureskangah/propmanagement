
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

interface VendorAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendors: Vendor[];
  onSuccess: () => void;
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
      // Ici, nous simulons une création de rendez-vous
      // Dans une application réelle, vous appelleriez votre API pour enregistrer le rendez-vous
      console.log("Créer un rendez-vous :", {
        vendorId: selectedVendor,
        date: selectedDate,
        time,
        title,
        notes
      });
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('success'),
        description: t('appointmentScheduled')
      });
      
      resetForm();
      onSuccess();
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('scheduleAppointment')}</DialogTitle>
          <DialogDescription>
            {t('scheduleAppointmentDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">{t('vendor')}</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger id="vendor">
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
            <Label>{t('date')}</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={locale === 'fr' ? fr : enUS}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">{t('time')}</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">{t('appointmentTitle')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('appointmentTitlePlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('scheduling') : t('schedule')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
