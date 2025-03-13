
import React from "react";
import { Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getDefaultImageByType, getBadgeColorByType } from "../utils/propertyCardUtils";

interface PropertyCardImageProps {
  image?: string;
  type: string;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
}

const PropertyCardImage = ({ image, type, imageLoaded, setImageLoaded }: PropertyCardImageProps) => {
  const { t } = useLocale();

  return (
    <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
      <div 
        className={cn(
          "absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse",
          imageLoaded ? "opacity-0" : "opacity-100"
        )}
      />
      <img
        src={image || getDefaultImageByType(type)}
        alt={`${type} - ${t('propertyImage')}`}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          "group-hover:scale-110 group-hover:rotate-1",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = getDefaultImageByType(type);
        }}
      />
      <div className="absolute top-3 left-3">
        <Badge className={cn(
          getBadgeColorByType(type), 
          "px-2 py-0.5 text-xs shadow-md font-medium"
        )}>
          <Home className="h-3 w-3 mr-1" />
          {t(type.toLowerCase())}
        </Badge>
      </div>
    </div>
  );
};

export default PropertyCardImage;
