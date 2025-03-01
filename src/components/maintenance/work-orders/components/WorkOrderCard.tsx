
import { Card, CardContent } from "@/components/ui/card";
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
  Clock 
} from "lucide-react";
import { WorkOrder } from "@/types/workOrder";
import { useLocale } from "@/components/providers/LocaleProvider";

interface WorkOrderCardProps {
  order: WorkOrder;
}

export const WorkOrderCard = ({ order }: WorkOrderCardProps) => {
  const { t } = useLocale();
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "In Progress":
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          className: "bg-blue-500/90"
        };
      case "Scheduled":
        return {
          variant: "secondary" as const,
          icon: <Clock className="h-4 w-4 mr-1" />,
          className: "bg-orange-500/90"
        };
      case "Completed":
        return {
          variant: "outline" as const,
          icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
          className: "bg-green-500/90 text-white"
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
    <Card key={order.id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border bg-card">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold group-hover:text-red-500 transition-colors duration-300">{order.title}</h3>
            <Wrench className="h-5 w-5 text-red-500 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          {order.property && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <p><strong>{t('property')}:</strong> {order.property}</p>
            </div>
          )}
          {order.unit && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <p><strong>{t('unit')}:</strong> {order.unit}</p>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`${statusConfig.className} transition-all duration-300 shadow-sm`}>
              <div className="flex items-center">
                {statusConfig.icon}
                {order.status}
              </div>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <p><strong>{t('vendor')}:</strong> {order.vendor}</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <p><strong>{t('cost')}:</strong> ${order.cost}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-300 hover:scale-105"
            >
              <FileImage className="h-4 w-4 mr-2" />
              {t('photos')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-300 hover:scale-105"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              {t('update')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
