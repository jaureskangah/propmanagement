
import React from "react";
import { WorkOrderCard } from "../WorkOrderCard";
import { WorkOrder } from "@/types/workOrder";

interface WorkOrderGridProps {
  orders: WorkOrder[];
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const WorkOrderGrid = ({ orders, onUpdate = () => {}, onDelete = () => {} }: WorkOrderGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <WorkOrderCard 
          key={order.id} 
          order={order} 
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
