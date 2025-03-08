
import React from "react";
import { Percent, Home, TrendingUp } from "lucide-react";
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
  
  // Calculate a random monthly income for demo purposes
  const monthlyIncome = units * Math.floor(Math.random() * 300 + 700);
  
  return (
    <CardContent className="p-4 pt-1 mt-auto">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-2.5 rounded-lg shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <Home className="h-3.5 w-3.5" /> {t('propertyUnits')}
          </p>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{units}</p>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-2.5 rounded-lg shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <Percent className="h-3.5 w-3.5" /> {t('occupancyRate')} (%)
          </p>
          <p className={cn(
            "text-lg font-semibold",
            getOccupancyColor(occupancyRate)
          )}>
            {occupancyRate !== undefined ? `${occupancyRate}%` : 'N/A'}
          </p>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-2.5 rounded-lg shadow-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <TrendingUp className="h-3.5 w-3.5" /> {t('monthlyIncome')}
          </p>
          <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            ${monthlyIncome}
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default PropertyCardDetails;
