import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Edit, Trash2, DollarSign } from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    units: number;
    type: string;
    image?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
}

const PropertyCard = ({ property, onEdit, onDelete, onViewFinancials }: PropertyCardProps) => {
  console.log("Rendering PropertyCard for:", property.name);
  
  return (
    <Card className="w-full min-w-[300px] h-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">{property.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewFinancials(property.id)}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(property.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(property.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="mt-2 text-sm break-words">{property.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Units</p>
            <p className="text-lg font-semibold">{property.units}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <p className="text-lg font-semibold">{property.type}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;