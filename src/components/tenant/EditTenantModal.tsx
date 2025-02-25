
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TenantForm } from "./TenantForm";
import type { TenantFormValues } from "./tenantValidation";
import type { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  onSubmit: (data: TenantFormValues) => Promise<void>;
}

export function EditTenantModal({ isOpen, onClose, tenant, onSubmit }: EditTenantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLocale();

  const handleSubmit = async (data: TenantFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: t('success'),
        description: t('tenantUpdated'),
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
          <DialogTitle>{t('editTenant')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4">
          <TenantForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onClose}
            defaultValues={{
              name: tenant.name,
              email: tenant.email,
              phone: tenant.phone || "",
              property_id: tenant.property_id || "",
              unit_number: tenant.unit_number,
              lease_start: tenant.lease_start,
              lease_end: tenant.lease_end,
              rent_amount: tenant.rent_amount,
            }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
