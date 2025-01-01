import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle2, Wrench } from "lucide-react";

interface WorkOrderStatusProps {
  status: string;
}

export const getStatusConfig = (status: string) => {
  switch (status) {
    case "In Progress":
      return {
        variant: "default" as const,
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        className: "bg-blue-500"
      };
    case "Scheduled":
      return {
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
        className: "bg-orange-500"
      };
    case "Completed":
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

export const WorkOrderStatus = ({ status }: WorkOrderStatusProps) => {
  const statusConfig = getStatusConfig(status);
  
  return (
    <Badge className={statusConfig.className}>
      <div className="flex items-center">
        {statusConfig.icon}
        {status}
      </div>
    </Badge>
  );
};