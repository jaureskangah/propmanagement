
import React from "react";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showFilters ? 1 : 0,
          height: showFilters ? "auto" : 0
        }}
        transition={{ duration: 0.3 }}
        className={`overflow-hidden ${showFilters ? 'mb-6' : 'mb-0'}`}
      >
        <PropertyFilters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          propertyTypes={propertyTypes}
        />
      </motion.div>

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
