
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TenantForm } from "./TenantForm";
import type { TenantFormValues } from "./tenantValidation";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddTenantModal({ isOpen, onClose, onSubmit }: AddTenantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLocale();

  const handleSubmit = async (data: TenantFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: t('success'),
        description: t('tenantAdded'),
      });
      onClose();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('list.addTenant')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4">
          <TenantForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onClose}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
