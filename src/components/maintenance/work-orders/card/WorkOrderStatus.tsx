
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
        icon: <AlertCircle className="h-4 w-4 mr-1 animate-pulse" />,
        className: "bg-blue-600 text-white font-medium shadow-sm"
      };
    case "Scheduled":
      return {
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1 animate-spin-slow" />,
        className: "bg-orange-500 text-white font-medium shadow-sm"
      };
    case "Completed":
      return {
        variant: "outline" as const,
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
        className: "bg-green-600 text-white font-medium shadow-sm"
      };
    default:
      return {
        variant: "default" as const,
        icon: <Wrench className="h-4 w-4 mr-1" />,
        className: "bg-gray-600 text-white font-medium shadow-sm"
      };
  }
};

export const WorkOrderStatus = ({ status }: WorkOrderStatusProps) => {
  const statusConfig = getStatusConfig(status);
  
  return (
    <Badge className={`${statusConfig.className} transition-all duration-200 hover:scale-105`}>
      <div className="flex items-center">
        {statusConfig.icon}
        {status}
      </div>
    </Badge>
  );
};
