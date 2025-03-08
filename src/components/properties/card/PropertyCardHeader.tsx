
import React from "react";
import { MapPin } from "lucide-react";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import PropertyCardActions from "./PropertyCardActions";

interface PropertyCardHeaderProps {
  name: string;
  address: string;
  id: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
}

const PropertyCardHeader = ({ 
  name, 
  address, 
  id, 
  onEdit, 
  onDelete, 
  onViewFinancials 
}: PropertyCardHeaderProps) => {
  return (
    <CardHeader className="space-y-2 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-bold line-clamp-2">
            {name}
          </CardTitle>
          <CardDescription className="flex items-center text-sm break-words line-clamp-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-muted-foreground" />
            {address}
          </CardDescription>
        </div>
        <PropertyCardActions 
          id={id} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onViewFinancials={onViewFinancials} 
        />
      </div>
    </CardHeader>
  );
};

export default PropertyCardHeader;
