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
import { Badge } from "@/components/ui/badge";

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
  const placeholderImage = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&auto=format&fit=crop&q=60";
  
  return (
    <Card className="w-full h-full group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-t-lg">
        <img
          src={property.image || placeholderImage}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
      </div>
      
      <CardHeader className="space-y-2 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2">{property.name}</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {property.type}
            </Badge>
          </div>
          <div className="flex sm:flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewFinancials(property.id)}
              className="hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(property.id)}
              className="hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(property.id)}
              className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm break-words line-clamp-2">
          {property.address}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 p-2 sm:p-3 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Units</p>
            <p className="text-base sm:text-lg font-semibold">{property.units}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-2 sm:p-3 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Type</p>
            <p className="text-base sm:text-lg font-semibold capitalize">{property.type}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;