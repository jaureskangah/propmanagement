
import React from "react";
import { Percent, Home } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getOccupancyColor } from "../utils/propertyCardUtils";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PropertyCardDetailsProps {
  units: number;
  occupancyRate?: number;
}

const PropertyCardDetails = ({ units, occupancyRate }: PropertyCardDetailsProps) => {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <CardContent className="p-3 pt-1">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-2 rounded-md shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5 font-sans">
            <Home className="h-3 w-3" /> {t('propertyUnits')}
          </p>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 font-sans">{units}</p>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-2 rounded-md shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
          <p className={cn(
            "text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5 font-sans",
            isMobile ? "flex-wrap" : "whitespace-nowrap"
          )}>
            <Percent className="h-3 w-3 flex-shrink-0" /> {t('occupancyRate')}
          </p>
          <p className={cn(
            "text-lg font-semibold font-sans",
            getOccupancyColor(occupancyRate)
          )}>
            {occupancyRate !== undefined ? `${occupancyRate}%` : t('notAvailable')}
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default PropertyCardDetails;
