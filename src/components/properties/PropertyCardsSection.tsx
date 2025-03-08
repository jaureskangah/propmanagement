
import React from "react";
import { Property } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";
import EmptyState from "@/components/properties/EmptyState";

interface PropertyCardsSectionProps {
  properties: Property[];
  filteredProperties: Property[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
}

const PropertyCardsSection = ({
  properties,
  filteredProperties,
  onEdit,
  onDelete,
  onViewFinancials
}: PropertyCardsSectionProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (filteredProperties.length === 0) {
    return <EmptyState isFiltering={properties.length > 0} />;
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
    >
      {filteredProperties.map((property) => (
        <motion.div key={property.id} variants={item}>
          <PropertyCard
            property={property}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewFinancials={onViewFinancials}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyCardsSection;
