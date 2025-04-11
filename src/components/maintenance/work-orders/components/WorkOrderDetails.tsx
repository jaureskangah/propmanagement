
import React from "react";
import { 
  Building,
  Home,
  Wrench,
  DollarSign
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { WorkOrder } from "@/types/workOrder";
import { formatCurrency } from "@/lib/utils";

interface WorkOrderDetailsProps {
  order: WorkOrder;
}

export const WorkOrderDetails = ({ order }: WorkOrderDetailsProps) => {
  return (
    <div className="space-y-2 text-sm">
      {order.property && (
        <div className="flex items-center gap-2 flex-wrap">
          <Building className="h-4 w-4 min-w-4 text-gray-500" />
          <p className="truncate"><span className="font-medium">Propriété:</span> {order.property}</p>
        </div>
      )}
      {order.unit && (
        <div className="flex items-center gap-2 flex-wrap">
          <Home className="h-4 w-4 min-w-4 text-gray-500" />
          <p className="break-words"><span className="font-medium">Unité:</span> {order.unit}</p>
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <Wrench className="h-4 w-4 min-w-4 text-gray-500" />
        <p className="truncate break-words"><span className="font-medium">Prestataire:</span> {order.vendor}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <DollarSign className="h-4 w-4 min-w-4 text-gray-500" />
        <p className="whitespace-normal"><span className="font-medium">Coût:</span> {formatCurrency(order.cost)}</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <StatusBadge status={order.status} />
      </div>
    </div>
  );
};
