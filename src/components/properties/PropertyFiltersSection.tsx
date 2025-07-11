
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface PropertyFiltersSectionProps {
  showFilters: boolean;
  selectedType: string;
  setSelectedType: (type: string) => void;
  propertyTypes: readonly string[];
}

const PropertyFiltersSection = ({
  showFilters,
  selectedType,
  setSelectedType,
  propertyTypes
}: PropertyFiltersSectionProps) => {
  const { t } = useLocale();

  const getPropertyTypeTranslation = (type: string) => {
    if (type === "All") return t('all');
    
    switch (type) {
      case 'Commercial Space':
        return t('commercialspace');
      case 'Office':
        return t('propertyOffice');
      case 'Apartment':
        return t('apartment');
      case 'House':
        return t('house');
      case 'Condo':
        return t('condo');
      default:
        return type;
    }
  };

  if (!showFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="p-4 bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="text-sm font-medium mb-3 text-foreground/80 font-sans">{t('filterByType')}</h3>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                selectedType === type
                  ? "bg-primary text-white shadow-sm hover:-translate-y-1"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:-translate-y-1"
              } font-sans`}
            >
              {getPropertyTypeTranslation(type)}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyFiltersSection;
