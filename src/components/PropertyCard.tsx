
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getGradientByType } from "./properties/utils/propertyCardUtils";
import { BorderTrail } from "@/components/ui/border-trail";
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
    <Card className={cn(
      "relative h-full overflow-hidden transition-all duration-300 border border-slate-200 dark:border-slate-800",
      "hover:shadow-2xl hover:-translate-y-2 group cursor-pointer",
      "bg-gradient-to-br",
      getGradientByType(property.type)
    )}>
      <BorderTrail
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"
        size={80}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          boxShadow: "0px 0px 40px 20px rgb(59 130 246 / 30%)"
        }}
      />
      
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
        occupancyRate={property.occupancyRate}
      />
    </Card>
  );
};

export default PropertyCard;
