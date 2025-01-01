import { Card, CardContent } from "@/components/ui/card";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderHeader } from "./card/WorkOrderHeader";
import { WorkOrderStatus } from "./card/WorkOrderStatus";
import { WorkOrderDetails } from "./card/WorkOrderDetails";
import { WorkOrderActions } from "./card/WorkOrderActions";

interface WorkOrderCardProps {
  order: WorkOrder;
}

export const WorkOrderCard = ({ order }: WorkOrderCardProps) => {
  return (
    <Card>
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
          <WorkOrderActions />
        </div>
      </CardContent>
    </Card>
  );
};