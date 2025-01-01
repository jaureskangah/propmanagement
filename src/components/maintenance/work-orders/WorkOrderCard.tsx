import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  FileImage, 
  CheckSquare, 
  Building,
  Home,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2
} from "lucide-react";

interface WorkOrder {
  id: number;
  title: string;
  property: string;
  unit: string;
  status: string;
  vendor: string;
  cost: number;
  date?: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "En cours":
      return {
        variant: "default" as const,
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        className: "bg-blue-500"
      };
    case "Planifié":
      return {
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
        className: "bg-orange-500"
      };
    case "Terminé":
      return {
        variant: "outline" as const,
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
        className: "bg-green-500 text-white"
      };
    default:
      return {
        variant: "default" as const,
        icon: <Wrench className="h-4 w-4 mr-1" />,
        className: ""
      };
  }
};

interface WorkOrderCardProps {
  order: WorkOrder;
}

export const WorkOrderCard = ({ order }: WorkOrderCardProps) => {
  const statusConfig = getStatusConfig(order.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{order.title}</CardTitle>
          <Wrench className="h-5 w-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <p><strong>Propriété:</strong> {order.property}</p>
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-gray-500" />
            <p><strong>Unité:</strong> {order.unit}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusConfig.className}>
              <div className="flex items-center">
                {statusConfig.icon}
                {order.status}
              </div>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-gray-500" />
            <p><strong>Prestataire:</strong> {order.vendor}</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <p><strong>Coût:</strong> {order.cost}€</p>
          </div>
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
  );
};