import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VendorReviewForm } from "./VendorReviewForm";

interface VendorReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  vendorName: string;
  onSuccess: () => void;
}

export const VendorReviewDialog = ({
  open,
  onOpenChange,
  vendorId,
  vendorName,
  onSuccess,
}: VendorReviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Évaluer {vendorName}</DialogTitle>
        </DialogHeader>
        <VendorReviewForm
          vendorId={vendorId}
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