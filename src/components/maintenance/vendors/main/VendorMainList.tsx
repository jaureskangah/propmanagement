
import React from "react";
import { VendorCard } from "../VendorCard";
import { Vendor } from "@/types/vendor";

interface VendorMainListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onReview?: (vendor: { id: string; name: string }) => void;
}

export const VendorMainList = ({
  vendors,
  onEdit,
  onDelete,
  onReview
}: VendorMainListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.length === 0 ? (
        <div className="col-span-full text-center py-10 border rounded-lg border-dashed">
          <p className="text-muted-foreground">Aucun fournisseur ne correspond à vos critères</p>
        </div>
      ) : (
        vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onEdit={() => onEdit(vendor)}
            onDelete={() => onDelete(vendor)}
            onReview={onReview ? () => onReview({ id: vendor.id, name: vendor.name }) : undefined}
          />
        ))
      )}
    </div>
  );
};
