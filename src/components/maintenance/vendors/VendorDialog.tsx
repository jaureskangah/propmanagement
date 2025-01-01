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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {vendor ? "Modifier le prestataire" : "Ajouter un prestataire"}
          </DialogTitle>
        </DialogHeader>
        <VendorForm
          defaultValues={vendor}
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