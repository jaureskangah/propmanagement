
import React from "react";
import { MapPin, Tag } from "lucide-react";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import PropertyCardActions from "./PropertyCardActions";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyCardHeaderProps {
  name: string;
  address: string;
  id: string;
  type: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
}

const PropertyCardHeader = ({ 
  name, 
  address, 
  id,
  type,
  onEdit, 
  onDelete, 
  onViewFinancials 
}: PropertyCardHeaderProps) => {
  const { t } = useLocale();
  
  return (
    <CardHeader className="p-4 pb-2 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-bold line-clamp-1 text-slate-800 dark:text-slate-100">
            {name}
          </CardTitle>
          <CardDescription className="flex items-center text-sm break-words line-clamp-2 text-slate-600 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
            {address}
          </CardDescription>
          <CardDescription className="flex items-center text-xs break-words text-slate-500 dark:text-slate-500">
            <Tag className="h-3 w-3 mr-1.5 flex-shrink-0" />
            {t(type.toLowerCase())}
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
