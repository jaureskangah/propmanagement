
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getGradientByType } from "./properties/utils/propertyCardUtils";
import PropertyCardImage from "./properties/card/PropertyCardImage";
import PropertyCardHeader from "./properties/card/PropertyCardHeader";
import PropertyCardDetails from "./properties/card/PropertyCardDetails";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    units: number;
    type: string;
    image?: string;
    occupancyRate?: number;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
}

const PropertyCard = ({ property, onEdit, onDelete, onViewFinancials }: PropertyCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Card className={`w-full h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${getGradientByType(property.type)}`}>
      <PropertyCardImage 
        image={property.image}
        type={property.type}
        imageLoaded={imageLoaded}
        setImageLoaded={setImageLoaded}
      />
      
      <PropertyCardHeader 
        name={property.name}
        address={property.address}
        id={property.id}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewFinancials={onViewFinancials}
      />
      
      <PropertyCardDetails 
        units={property.units}
        type={property.type}
        occupancyRate={property.occupancyRate}
      />
    </Card>
  );
};

export default PropertyCard;
