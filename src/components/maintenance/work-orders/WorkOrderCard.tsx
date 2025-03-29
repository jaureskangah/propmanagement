
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderHeader } from "./card/WorkOrderHeader";
import { WorkOrderStatus } from "./card/WorkOrderStatus";
import { WorkOrderDetails } from "./card/WorkOrderDetails";
import { WorkOrderActions } from "./card/WorkOrderActions";
import { motion } from "framer-motion";

interface WorkOrderCardProps {
  order: WorkOrder;
  onUpdate: () => void;
  onDelete: () => void;
}

export const WorkOrderCard = ({ order, onUpdate, onDelete }: WorkOrderCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full shadow-sm border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-t-lg">
          <WorkOrderHeader 
            title={order.title} 
            priority={order.priority} 
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <WorkOrderStatus status={order.status} />
            <WorkOrderDetails
              property={order.property}
              unit={order.unit}
              vendor={order.vendor}
              cost={order.cost}
              date={order.date}
            />
            <WorkOrderActions 
              order={order}
              onStatusChange={onUpdate}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
