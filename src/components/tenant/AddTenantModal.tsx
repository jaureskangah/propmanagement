
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TenantForm } from "./TenantForm";
import type { TenantFormValues } from "./tenantValidation";
import { useTenantListTranslations } from "@/hooks/useTenantListTranslations";
import { LimitChecker } from "@/components/subscription/LimitChecker";
import { useTenants } from "@/hooks/useTenants";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddTenantModal({ isOpen, onClose, onSubmit }: AddTenantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTenantListTranslations();
  const { tenants } = useTenants();

  const handleSubmit = async (data: TenantFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: "Succès",
        description: "Locataire ajouté avec succès",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
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
          <DialogTitle>{t('addTenant')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4">
          <LimitChecker
            type="tenants"
            currentCount={tenants?.length || 0}
            onLimitReached={onClose}
          >
            <TenantForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={onClose}
            />
          </LimitChecker>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
