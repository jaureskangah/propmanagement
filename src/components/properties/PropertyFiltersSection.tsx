
import React from "react";
import PropertyFilters from "@/components/properties/PropertyFilters";

interface PropertyFiltersSectionProps {
  showFilters: boolean;
  selectedType: string;
  setSelectedType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  propertyTypes: readonly string[];
}

const PropertyFiltersSection = ({
  showFilters,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  propertyTypes
}: PropertyFiltersSectionProps) => {
  return (
    <>
      <div className={`overflow-hidden ${showFilters ? 'mb-6' : 'mb-0'}`}>
        {showFilters && (
          <PropertyFilters
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            propertyTypes={propertyTypes}
          />
        )}
      </div>

      <div className="flex md:hidden mb-4">
        <PropertyFilters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          propertyTypes={propertyTypes}
          compact={true}
        />
      </div>
    </>
  );
};

export default PropertyFiltersSection;
