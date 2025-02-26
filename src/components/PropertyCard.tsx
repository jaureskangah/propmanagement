
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
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const { t } = useLocale();
  
  const getDefaultImageByType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
      case 'house':
        return "https://images.unsplash.com/photo-1501854140801-50d01698950b";
      case 'studio':
        return "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
      case 'condo':
        return "https://images.unsplash.com/photo-1721322800607-8c38375eef04";
      case 'office':
        return "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7";
      case 'commercial space':
        return "https://images.unsplash.com/photo-1473091534298-04dcbce3278c";
      default:
        return "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    }
  };
  
  return (
    <Card className="w-full h-full group hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-t-lg bg-slate-100">
        <div 
          className={cn(
            "absolute inset-0 bg-slate-200 animate-pulse",
            imageLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        <img
          src={property.image || getDefaultImageByType(property.type)}
          alt={`${property.name} - ${t('propertyImage')}`}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            "group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getDefaultImageByType(property.type);
          }}
        />
      </div>
      
      <CardHeader className="space-y-2 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 animate-fade-in">
              {property.name}
            </CardTitle>
            <Badge variant="secondary" className="text-sm animate-fade-in">
              {t(property.type.toLowerCase())}
            </Badge>
          </div>
          <div className="flex sm:flex-col gap-2 animate-fade-in">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewFinancials(property.id)}
              className="hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title={t('viewFinancials')}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(property.id)}
              className="hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              title={t('editProperty')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(property.id)}
              className="hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title={t('deleteProperty')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm break-words line-clamp-2 animate-fade-in">
          {property.address}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in">
          <div className="bg-slate-50 dark:bg-slate-800 p-2 sm:p-3 rounded-lg transition-colors">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('propertyUnits')}</p>
            <p className="text-base sm:text-lg font-semibold">{property.units}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-2 sm:p-3 rounded-lg transition-colors">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('propertyType')}</p>
            <p className="text-base sm:text-lg font-semibold capitalize">{t(property.type.toLowerCase())}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
