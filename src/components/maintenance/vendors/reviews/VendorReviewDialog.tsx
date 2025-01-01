import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VendorReviewForm } from "./VendorReviewForm";
import { VendorReview } from "@/types/vendor";

interface VendorReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  vendorName?: string;
  initialData?: VendorReview;
  onSuccess: () => void;
}

export const VendorReviewDialog = ({
  open,
  onOpenChange,
  vendorId,
  vendorName,
  initialData,
  onSuccess,
}: VendorReviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'évaluation" : "Nouvelle évaluation"}
            {vendorName && ` pour ${vendorName}`}
          </DialogTitle>
        </DialogHeader>
        <VendorReviewForm
          vendorId={vendorId}
          initialData={initialData}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};