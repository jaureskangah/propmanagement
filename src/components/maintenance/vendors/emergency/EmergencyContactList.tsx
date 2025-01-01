import React from "react";
import { VendorCard } from "../VendorCard";
import { Vendor } from "@/types/vendor";

interface EmergencyContactListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const EmergencyContactList = ({ vendors, onEdit, onDelete }: EmergencyContactListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          isEmergencyView
          onEdit={() => onEdit(vendor)}
          onDelete={() => onDelete(vendor)}
        />
      ))}
    </div>
  );
};