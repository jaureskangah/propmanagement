
import React from "react";
import { WorkOrder } from "@/types/workOrder";
import { useWorkOrdersData } from "../hooks/useWorkOrdersData";
import { WorkOrderCard } from "@/components/maintenance/work-orders/WorkOrderCard";

interface WorkOrderGridProps {
  orders: WorkOrder[];
  onOrderUpdate?: () => void;
}

export const WorkOrderGrid = ({ orders, onOrderUpdate }: WorkOrderGridProps) => {
  const { refetch } = useWorkOrdersData();

  // Fonction pour gérer les mises à jour des ordres de travail
  const handleOrderUpdate = () => {
    // Rafraîchir les données
    refetch();
    
    // Propager l'événement au parent si nécessaire
    if (onOrderUpdate) {
      onOrderUpdate();
    }
  };

  // Isoler tous les événements qui pourraient se propager à travers le grid
  const handleGridEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (orders.length === 0) {
    return (
      <div 
        className="bg-muted/30 border-dashed border-2 rounded-lg p-8 text-center" 
        onClick={handleGridEvent}
        onMouseDown={handleGridEvent}
        onMouseUp={handleGridEvent}
      >
        <h3 className="font-medium text-lg mb-2">Aucun ordre de travail trouvé</h3>
        <p className="text-muted-foreground">Ajoutez de nouveaux ordres de travail ou modifiez vos filtres.</p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
      onClick={handleGridEvent}
      onMouseDown={handleGridEvent}
      onMouseUp={handleGridEvent}
    >
      {orders.map((order) => (
        <WorkOrderCard
          key={order.id}
          order={order}
          onUpdate={handleOrderUpdate}
          onDelete={handleOrderUpdate}
        />
      ))}
    </div>
  );
};
