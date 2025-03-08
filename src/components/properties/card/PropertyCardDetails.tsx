
import React from "react";
import { Percent, Home } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getOccupancyColor } from "../utils/propertyCardUtils";
import { cn } from "@/lib/utils";

interface PropertyCardDetailsProps {
  units: number;
  occupancyRate?: number;
}

const PropertyCardDetails = ({ units, occupancyRate }: PropertyCardDetailsProps) => {
  const { t } = useLocale();
  
  return (
    <CardContent className="p-4 pt-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <Home className="h-3.5 w-3.5" /> {t('propertyUnits')}
          </p>
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">{units}</p>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-3 px-5 rounded-lg shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1 whitespace-nowrap">
            <Percent className="h-3.5 w-3.5 flex-shrink-0" /> {t('occupancyRate')}
          </p>
          <p className={cn(
            "text-xl font-semibold",
            getOccupancyColor(occupancyRate)
          )}>
            {occupancyRate !== undefined ? `${occupancyRate}%` : 'N/A'}
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default PropertyCardDetails;
