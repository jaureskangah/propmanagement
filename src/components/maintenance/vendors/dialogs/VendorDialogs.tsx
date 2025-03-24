
import React from "react";
import { VendorDialog } from "../VendorDialog";
import { VendorReviewDialog } from "../reviews/VendorReviewDialog";
import { Vendor } from "@/types/vendor";

interface VendorDialogsProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedVendor: Vendor | undefined;
  reviewDialogOpen: boolean;
  setReviewDialogOpen: (open: boolean) => void;
  selectedVendorForReview: { id: string; name: string } | null;
  setSelectedVendorForReview: (vendor: { id: string; name: string } | null) => void;
  refetch: () => void;
  refetchReviews: () => void;
}

export const VendorDialogs = ({
  dialogOpen,
  setDialogOpen,
  selectedVendor,
  reviewDialogOpen,
  setReviewDialogOpen,
  selectedVendorForReview,
  setSelectedVendorForReview,
  refetch,
  refetchReviews
}: VendorDialogsProps) => {
  return (
    <>
      <VendorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vendor={selectedVendor}
        onSuccess={() => {
          setDialogOpen(false);
          refetch();
        }}
      />

      {selectedVendorForReview && (
        <VendorReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          vendorId={selectedVendorForReview.id}
          vendorName={selectedVendorForReview.name}
          onSuccess={() => {
            setReviewDialogOpen(false);
            setSelectedVendorForReview(null);
            refetchReviews();
          }}
        />
      )}
    </>
  );
};
