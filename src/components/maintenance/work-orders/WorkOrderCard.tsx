import { Card, CardContent } from "@/components/ui/card";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderHeader } from "./card/WorkOrderHeader";
import { WorkOrderStatus } from "./card/WorkOrderStatus";
import { WorkOrderDetails } from "./card/WorkOrderDetails";
import { WorkOrderActions } from "./card/WorkOrderActions";

interface WorkOrderCardProps {
  order: WorkOrder;
  onUpdate: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const WorkOrderCard = ({ order, onUpdate, onDelete, onDuplicate }: WorkOrderCardProps) => {
  return (
    <Card className="group transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <WorkOrderHeader title={order.title} />
      <CardContent>
        <div className="space-y-2">
          <WorkOrderDetails
            property={order.property}
            unit={order.unit}
            vendor={order.vendor}
            cost={order.cost}
          />
          <div className="flex items-center gap-2 mt-2">
            <WorkOrderStatus status={order.status} />
          </div>
          <WorkOrderActions 
            orderId={order.id}
            status={order.status}
            onStatusChange={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        </div>
      </CardContent>
    </Card>
  );
};