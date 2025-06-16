
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getGradientByType } from "./properties/utils/propertyCardUtils";
import { MovingBorder } from "@/components/ui/moving-border";
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
    <div className="relative p-[2px] rounded-xl">
      <div className="absolute inset-0 rounded-xl">
        <MovingBorder duration={3000} rx="20%" ry="20%">
          <div className="h-16 w-16 opacity-[0.6] bg-[radial-gradient(var(--blue-500)_40%,transparent_60%)]" />
        </MovingBorder>
      </div>
      
      <Card className={cn(
        "relative h-full overflow-hidden transition-all duration-300 border-0",
        "hover:shadow-lg hover:scale-[1.01] group rounded-xl",
        "bg-gradient-to-br backdrop-blur-sm",
        getGradientByType(property.type)
      )}>
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
    </div>
  );
};

export default PropertyCard;
