
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  FileImage, 
  CheckSquare, 
  Building,
  Home,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface WorkOrderCardProps {
  order: WorkOrder;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const WorkOrderCard = ({ order, onUpdate, onDelete }: WorkOrderCardProps) => {
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

  const statusConfig = getStatusConfig(order.status);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{order.title}</CardTitle>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onUpdate}>Modifier</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2 text-sm">
          {order.property && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <p className="truncate"><span className="font-medium">Propriété:</span> {order.property}</p>
            </div>
          )}
          {order.unit && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-gray-500" />
              <p><span className="font-medium">Unité:</span> {order.unit}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-gray-500" />
            <p className="truncate"><span className="font-medium">Prestataire:</span> {order.vendor}</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <p><span className="font-medium">Coût:</span> {order.cost}€</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={statusConfig.className}>
              <div className="flex items-center">
                {statusConfig.icon}
                {order.status}
              </div>
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap gap-2 justify-between">
        <Button variant="outline" size="sm" className="h-8">
          <FileImage className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Photos</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          <CheckSquare className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Mettre à jour</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
