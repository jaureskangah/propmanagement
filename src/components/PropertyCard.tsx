
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Edit, Trash2, DollarSign, Percent, MapPin, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Generate a gradient based on property type
  const getGradientByType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return "from-blue-500/10 to-blue-600/10";
      case 'house':
        return "from-green-500/10 to-green-600/10";
      case 'studio':
        return "from-purple-500/10 to-purple-600/10";
      case 'condo':
        return "from-indigo-500/10 to-indigo-600/10";
      case 'office':
        return "from-amber-500/10 to-amber-600/10";
      case 'commercial space':
        return "from-pink-500/10 to-red-600/10";
      default:
        return "from-slate-500/10 to-slate-600/10";
    }
  };
  
  // Get color for badge based on property type
  const getBadgeColorByType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case 'house':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'studio':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case 'condo':
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      case 'office':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case 'commercial space':
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      default:
        return "";
    }
  };

  // Calculate occupancy color
  const getOccupancyColor = (rate?: number) => {
    if (rate === undefined) return "text-slate-500";
    if (rate >= 80) return "text-green-600 dark:text-green-400";
    if (rate >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  
  return (
    <Card className={`w-full h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${getGradientByType(property.type)}`}>
      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div 
          className={cn(
            "absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse",
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
        <div className="absolute top-4 left-4">
          <Badge className={`${getBadgeColorByType(property.type)} px-2.5 py-1 shadow-sm`}>
            <Home className="h-3.5 w-3.5 mr-1" />
            {t(property.type.toLowerCase())}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="space-y-2 p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-bold line-clamp-2">
              {property.name}
            </CardTitle>
            <CardDescription className="flex items-center text-sm break-words line-clamp-2">
              <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-muted-foreground" />
              {property.address}
            </CardDescription>
          </div>
          <div className="flex sm:flex-col gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewFinancials(property.id);
                    }}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors h-8 w-8"
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('viewFinancials')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(property.id);
                    }}
                    className="hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-colors h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('editProperty')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(property.id);
                    }}
                    className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('deleteProperty')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 pt-0">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">{t('propertyUnits')}</p>
            <p className="text-lg font-semibold">{property.units}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">{t('propertyType')}</p>
            <p className="text-lg font-semibold capitalize">{t(property.type.toLowerCase())}</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Percent className="h-3 w-3" /> {t('occupancyRate')}
            </p>
            <p className={`text-lg font-semibold ${getOccupancyColor(property.occupancyRate)}`}>
              {property.occupancyRate !== undefined ? `${property.occupancyRate}%` : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
