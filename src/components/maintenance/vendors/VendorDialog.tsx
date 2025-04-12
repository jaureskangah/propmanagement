
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VendorForm } from "./VendorForm";
import { Vendor } from "@/types/vendor";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor;
  onSuccess: () => void;
}

export const VendorDialog = ({
  open,
  onOpenChange,
  vendor,
  onSuccess,
}: VendorDialogProps) => {
  const { t } = useLocale();
  
  const formDefaultValues = vendor ? {
    name: vendor.name,
    specialty: vendor.specialty,
    phone: vendor.phone,
    email: vendor.email,
    emergency_contact: vendor.emergency_contact,
    existingPhotos: vendor.photos,
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {vendor ? t('editVendor') : t('addNewVendor')}
          </DialogTitle>
          <DialogDescription>
            {vendor 
              ? t('updateVendorDescription') 
              : t('fillVendorDescription')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-120px)] pr-4">
          <VendorForm
            defaultValues={formDefaultValues}
            onSuccess={() => {
              onSuccess();
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
