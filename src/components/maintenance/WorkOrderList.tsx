import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, FileImage, CheckSquare, Plus } from "lucide-react";

// Types
interface WorkOrder {
  id: number;
  title: string;
  property: string;
  unit: string;
  status: string;
  vendor: string;
  cost: number;
}

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  onCreateWorkOrder: () => void;
}

export const WorkOrderList = ({ workOrders, onCreateWorkOrder }: WorkOrderListProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ordres de Travail</h2>
        <Button onClick={onCreateWorkOrder} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un Ordre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{order.title}</CardTitle>
                <Wrench className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Propriété:</strong> {order.property}</p>
                <p><strong>Unité:</strong> {order.unit}</p>
                <p><strong>Statut:</strong> {order.status}</p>
                <p><strong>Prestataire:</strong> {order.vendor}</p>
                <p><strong>Coût:</strong> {order.cost}€</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <FileImage className="h-4 w-4 mr-2" />
                    Photos
                  </Button>
                  <Button variant="outline" size="sm">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Mettre à jour
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};