
import React from "react";
import { Property } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import { motion } from "framer-motion";
import EmptyState from "@/components/properties/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Fetch tenants data to calculate actual occupancy rates
  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("*");
      
      if (error) {
        console.error("Error fetching tenants:", error);
        throw error;
      }
      
      return data;
    }
  });

  // Calculate occupancy rate for each property
  const propertiesWithOccupancy = filteredProperties.map(property => {
    const propertyTenants = tenants.filter(tenant => tenant.property_id === property.id);
    const occupiedUnits = propertyTenants.length;
    const occupancyRate = property.units > 0 ? Math.round((occupiedUnits / property.units) * 100) : 0;
    
    return {
      ...property,
      occupancyRate
    };
  });

  if (filteredProperties.length === 0) {
    return <EmptyState isFiltering={properties.length > 0} />;
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
    >
      {propertiesWithOccupancy.map((property) => (
        <motion.div 
          key={property.id} 
          variants={item}
          className="h-full dark-card-gradient"
          layout
        >
          <PropertyCard
            property={{
              id: property.id,
              name: property.name,
              address: property.address,
              units: property.units,
              type: property.type,
              image: property.image_url,
              occupancyRate: property.occupancyRate
            }}
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
