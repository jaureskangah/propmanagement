
import React from "react";
import { VendorSearchFilters } from "../filters/VendorSearchFilters";
import { VendorAdvancedFilters } from "../filters/VendorAdvancedFilters";
import { VendorSpecialtyFilters } from "../filters/VendorSpecialtyFilters";
import { VendorMainList } from "./VendorMainList";
import { Vendor } from "@/types/vendor";

interface VendorMainContentProps {
  vendors: Vendor[];
  specialties: string[];
  selectedSpecialty: string | null;
  searchQuery: string;
  selectedRating: string | null;
  showEmergencyOnly: boolean;
  showAvailableOnly: boolean;
  selectedAvailability: string | null;
  onSpecialtyChange: (specialty: string | null) => void;
  onSearchChange: (query: string) => void;
  onRatingChange: (rating: string | null) => void;
  onEmergencyChange: (show: boolean) => void;
  onAvailableChange: (show: boolean) => void;
  onAvailabilityChange: (availability: string | null) => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onReview: (vendor: { id: string; name: string }) => void;
}

export const VendorMainContent = ({
  vendors,
  specialties,
  selectedSpecialty,
  searchQuery,
  selectedRating,
  showEmergencyOnly,
  showAvailableOnly,
  selectedAvailability,
  onSpecialtyChange,
  onSearchChange,
  onRatingChange,
  onEmergencyChange,
  onAvailableChange,
  onAvailabilityChange,
  onEdit,
  onDelete,
  onReview
}: VendorMainContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <VendorSearchFilters
            searchQuery={searchQuery}
            setSearchQuery={onSearchChange}
            selectedRating={selectedRating}
            setSelectedRating={onRatingChange}
            showEmergencyOnly={showEmergencyOnly}
            setShowEmergencyOnly={onEmergencyChange}
          />
        </div>
        
        <VendorAdvancedFilters
          specialties={specialties}
          selectedSpecialty={selectedSpecialty}
          onSpecialtyChange={onSpecialtyChange}
          selectedRating={selectedRating}
          onRatingChange={onRatingChange}
          showEmergencyOnly={showEmergencyOnly}
          onEmergencyChange={onEmergencyChange}
          showAvailableOnly={showAvailableOnly}
          onAvailableChange={onAvailableChange}
          selectedAvailability={selectedAvailability}
          onAvailabilityChange={onAvailabilityChange}
        />
      </div>

      <VendorSpecialtyFilters
        specialties={specialties}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={onSpecialtyChange}
      />

      <VendorMainList
        vendors={vendors}
        onEdit={onEdit}
        onDelete={onDelete}
        onReview={onReview}
      />
    </div>
  );
};
