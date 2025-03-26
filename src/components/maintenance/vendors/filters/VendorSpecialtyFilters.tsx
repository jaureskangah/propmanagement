
import React from "react";
import { Button } from "@/components/ui/button";

interface VendorSpecialtyFiltersProps {
  specialties: string[];
  selectedSpecialty: string | null;
  onSpecialtyChange: (specialty: string | null) => void;
}

export const VendorSpecialtyFilters = ({
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
}: VendorSpecialtyFiltersProps) => {
  // Filter out any empty specialties
  const validSpecialties = specialties.filter(specialty => specialty && specialty.trim() !== "");
  
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={selectedSpecialty === null ? "default" : "outline"}
        onClick={() => onSpecialtyChange(null)}
      >
        All
      </Button>
      {validSpecialties.map(specialty => (
        <Button
          key={specialty}
          variant={selectedSpecialty === specialty ? "default" : "outline"}
          onClick={() => onSpecialtyChange(specialty)}
        >
          {specialty}
        </Button>
      ))}
    </div>
  );
};
