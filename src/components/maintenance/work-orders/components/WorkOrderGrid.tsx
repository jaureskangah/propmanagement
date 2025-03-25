
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderCard } from "./WorkOrderCard";

interface WorkOrderGridProps {
  orders: WorkOrder[];
}

export const WorkOrderGrid = ({ orders }: WorkOrderGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <WorkOrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
