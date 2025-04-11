
import React from "react";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderCard } from "../WorkOrderCard";

interface WorkOrderGridProps {
  orders: WorkOrder[];
  onOrderUpdate?: () => void;
  onOrderDelete?: () => void;
}

export const WorkOrderGrid = ({ orders, onOrderUpdate, onOrderDelete }: WorkOrderGridProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg border-dashed">
        <p className="text-muted-foreground">Aucun ordre de travail ne correspond à vos critères</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {orders.map((order) => (
        <WorkOrderCard 
          key={order.id} 
          order={order}
          onUpdate={onOrderUpdate}
          onDelete={onOrderDelete}
        />
      ))}
    </div>
  );
}
