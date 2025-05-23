
import React from "react";
import { MapPin } from "lucide-react";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import PropertyCardActions from "./PropertyCardActions";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { t } = useLocale();
  const isMobile = useIsMobile();
  
  return (
    <CardHeader className="p-3 pb-1">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-md font-bold line-clamp-1 text-slate-800 dark:text-slate-100 font-sans">
            {name}
          </CardTitle>
          <CardDescription className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-sans">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-slate-500 dark:text-slate-400" />
            <span className="break-words line-clamp-1">{address}</span>
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
