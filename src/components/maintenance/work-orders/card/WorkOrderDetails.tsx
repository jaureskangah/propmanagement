
import { Building, DollarSign, Calendar, Home, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

interface WorkOrderDetailsProps {
  property?: string;
  unit?: string;
  vendor: string;
  cost: number;
  date?: string;
}

export const WorkOrderDetails = ({ property, unit, vendor, cost, date }: WorkOrderDetailsProps) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Non défini";
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <div className="space-y-2 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {property && (
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{property}</span>
          </div>
        )}
        
        {unit && (
          <div className="flex items-center text-sm">
            <Home className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">Unité: {unit}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-700">{vendor}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-700">{formatCurrency(cost)}</span>
        </div>
        
        {date && (
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{formatDate(date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
