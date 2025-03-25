
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
  Clock,
  Hammer,
  Calendar 
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
          className: "bg-blue-500/90 text-white"
        };
      case "Scheduled":
        return {
          variant: "secondary" as const,
          icon: <Calendar className="h-4 w-4 mr-1" />,
          className: "bg-orange-500/90 text-white"
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
    <Card key={order.id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border bg-card overflow-hidden dark-card-gradient">
      <div className={`h-1 ${
        order.status === "Completed" ? "bg-green-500" :
        order.status === "In Progress" ? "bg-blue-500" :
        order.status === "Scheduled" ? "bg-orange-500" : "bg-gray-500"
      }`} />
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold group-hover:text-red-500 transition-colors duration-300 dark:text-white">{order.title}</h3>
            <Hammer className="h-5 w-5 text-red-500 transition-transform duration-300 group-hover:rotate-12" />
          </div>
          {order.property && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="dark:text-gray-200">{t('property')}:</strong> {order.property}</p>
            </div>
          )}
          {order.unit && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="dark:text-gray-200">{t('unit')}:</strong> {order.unit}</p>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`${statusConfig.className} transition-all duration-300 shadow-sm`}>
              <div className="flex items-center">
                {statusConfig.icon}
                {order.status}
              </div>
            </Badge>
            
            {order.priority && (
              <Badge className={`
                ${order.priority === "Urgent" ? "bg-red-500" : 
                  order.priority === "High" ? "bg-orange-500" : 
                  order.priority === "Medium" ? "bg-yellow-500" : 
                  "bg-green-500"} 
                text-white transition-all duration-300 shadow-sm`
              }>
                {order.priority}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="dark:text-gray-200">{t('vendor')}:</strong> {order.vendor}</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="dark:text-gray-200">{t('cost')}:</strong> ${order.cost}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-700"
            >
              <FileImage className="h-4 w-4 mr-2" />
              {t('photos')}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-700"
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
