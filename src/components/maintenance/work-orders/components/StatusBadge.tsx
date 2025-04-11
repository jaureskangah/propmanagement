
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "En cours":
      case "In Progress":
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          className: "bg-blue-500"
        };
      case "Planifié":
      case "Scheduled":
        return {
          variant: "secondary" as const,
          icon: <Clock className="h-4 w-4 mr-1" />,
          className: "bg-orange-500"
        };
      case "Terminé":
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
