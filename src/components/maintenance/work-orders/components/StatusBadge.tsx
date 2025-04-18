
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2,
  AlertCircle,
  Clock,
  Wrench
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t, language } = useLocale();
  
  const getTranslatedStatus = (originalStatus: string) => {
    if (language === 'fr') {
      switch (originalStatus) {
        case "Scheduled": return "Planifié";
        case "In Progress": return "En cours";
        case "Completed": return "Terminé";
        case "Resolved": return "Résolue";
        case "Pending": return "En attente";
        default: return originalStatus;
      }
    }
    
    return originalStatus;
  };

  const getStatusConfig = (originalStatus: string) => {
    const translatedStatus = getTranslatedStatus(originalStatus);
    
    if (translatedStatus === "En cours" || originalStatus === "In Progress") {
      return {
        variant: "default" as const,
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        className: "bg-blue-500",
        displayText: translatedStatus
      };
    } else if (translatedStatus === "Planifié" || originalStatus === "Scheduled") {
      return {
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
        className: "bg-orange-500",
        displayText: translatedStatus
      };
    } else if (translatedStatus === "Terminé" || originalStatus === "Completed" || 
               translatedStatus === "Résolue" || originalStatus === "Resolved") {
      return {
        variant: "outline" as const,
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
        className: "bg-green-500 text-white",
        displayText: translatedStatus
      };
    } else if (translatedStatus === "En attente" || originalStatus === "Pending") {
      return {
        variant: "secondary" as const,
        icon: <Clock className="h-4 w-4 mr-1" />,
        className: "bg-yellow-500",
        displayText: translatedStatus
      };
    } else {
      return {
        variant: "default" as const,
        icon: <Wrench className="h-4 w-4 mr-1" />,
        className: "",
        displayText: translatedStatus
      };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Badge className={statusConfig.className}>
      <div className="flex items-center">
        {statusConfig.icon}
        {statusConfig.displayText}
      </div>
    </Badge>
  );
};
