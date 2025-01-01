import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VendorForm } from "./VendorForm";
import { Vendor } from "@/types/vendor";

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
  // Convert the vendor data to match VendorForm's expected format
  const formDefaultValues = vendor ? {
    name: vendor.name,
    specialty: vendor.specialty,
    phone: vendor.phone,
    email: vendor.email,
    emergency_contact: vendor.emergency_contact,
    // We don't pass the photos as Files since they're already uploaded
    // They'll be handled separately in the form
    existingPhotos: vendor.photos,
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {vendor ? "Modifier le prestataire" : "Ajouter un prestataire"}
          </DialogTitle>
        </DialogHeader>
        <VendorForm
          defaultValues={formDefaultValues}
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};