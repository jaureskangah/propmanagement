
import React from "react";
import { Percent } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getOccupancyColor } from "../utils/propertyCardUtils";

interface PropertyCardDetailsProps {
  units: number;
  occupancyRate?: number;
}

const PropertyCardDetails = ({ units, occupancyRate }: PropertyCardDetailsProps) => {
  const { t } = useLocale();
  
  return (
    <CardContent className="p-5 pt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">{t('propertyUnits')}</p>
          <p className="text-lg font-semibold">{units}</p>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg shadow-sm">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Percent className="h-3 w-3" /> {t('occupancyRate')}
          </p>
          <p className={`text-lg font-semibold ${getOccupancyColor(occupancyRate)}`}>
            {occupancyRate !== undefined ? `${occupancyRate}%` : 'N/A'}
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default PropertyCardDetails;
