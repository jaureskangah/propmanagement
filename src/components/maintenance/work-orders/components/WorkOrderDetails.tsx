
import React from "react";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Building, Home, DollarSign, Clock, FileText, Star } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrderDetailsProps {
  order: WorkOrder;
}

export const WorkOrderDetails = ({ order }: WorkOrderDetailsProps) => {
  const { t, language } = useLocale();
  
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "Haute":
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Moyenne":
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Basse":
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-3">
      {order.description && (
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700 line-clamp-3">{order.description}</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={order.status} />
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" 
              style={{ backgroundColor: getPriorityBadgeColor(order.priority) }}>
          <Star className="h-3 w-3 mr-1" />
          {order.priority}
        </span>
      </div>
      
      <div className="space-y-2">
        {order.property && (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <p className="text-sm"><span className="font-medium">{t('property')}:</span> {order.property}</p>
          </div>
        )}
        
        {order.unit && (
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-500" />
            <p className="text-sm"><span className="font-medium">{t('unit')}:</span> {order.unit}</p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <p className="text-sm"><span className="font-medium">{t('cost')}:</span> {formatCurrency(order.cost)}</p>
        </div>
        
        {order.date && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <p className="text-sm"><span className="font-medium">{t('date')}:</span> {order.date}</p>
          </div>
        )}
      </div>
    </div>
  );
};
