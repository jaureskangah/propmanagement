import React from "react";
import { VendorCard } from "../VendorCard";
import { VendorFilters } from "../VendorFilters";
import { Vendor } from "@/types/vendor";

interface VendorMainListProps {
  vendors: Vendor[];
  selectedSpecialty: string | null;
  onSpecialtyChange: (specialty: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRating: string | null;
  onRatingChange: (rating: string | null) => void;
  showEmergencyOnly: boolean;
  onEmergencyChange: (show: boolean) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export const VendorMainList = ({
  vendors,
  selectedSpecialty,
  onSpecialtyChange,
  searchQuery,
  onSearchChange,
  selectedRating,
  onRatingChange,
  showEmergencyOnly,
  onEmergencyChange,
  onEdit,
  onDelete,
}: VendorMainListProps) => {
  const specialties = [...new Set(vendors.map(vendor => vendor.specialty))];

  return (
    <div className="space-y-4">
      <VendorFilters
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={onSpecialtyChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedRating={selectedRating}
        onRatingChange={onRatingChange}
        showEmergencyOnly={showEmergencyOnly}
        onEmergencyChange={onEmergencyChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onEdit={() => onEdit(vendor)}
            onDelete={() => onDelete(vendor)}
          />
        ))}
      </div>
    </div>
  );
};