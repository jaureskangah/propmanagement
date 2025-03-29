
import { WorkOrder } from "@/types/workOrder";
import { WorkOrderCard } from "../../work-orders/WorkOrderCard";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

interface WorkOrderGridProps {
  orders: WorkOrder[];
}

export const WorkOrderGrid = ({ orders }: WorkOrderGridProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleOrderUpdate = () => {
    // Force a re-render of the grid
    setRefreshKey(prev => prev + 1);
  };
  
  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center p-6 sm:p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300"
      >
        <Wrench className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Aucun ordre de travail</h3>
        <p className="text-gray-500 text-center mt-2">
          Les ordres de travail que vous créez apparaîtront ici.
        </p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      key={refreshKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {orders.map((order) => (
        <WorkOrderCard
          key={order.id}
          order={order}
          onUpdate={handleOrderUpdate}
          onDelete={handleOrderUpdate}
        />
      ))}
    </motion.div>
  );
};
