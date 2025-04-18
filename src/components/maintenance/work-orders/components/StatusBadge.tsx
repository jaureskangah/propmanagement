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
    if (["Planifié", "En cours", "Terminé"].includes(originalStatus)) {
      return originalStatus;
    }
    
    switch (originalStatus) {
      case "Scheduled": return language === 'fr' ? "Planifié" : "Scheduled";
      case "In Progress": return language === 'fr' ? "En cours" : "In Progress";
      case "Completed": return language === 'fr' ? "Terminé" : "Completed";
      default: return originalStatus;
    }
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
    } else if (translatedStatus === "Terminé" || originalStatus === "Completed") {
      return {
        variant: "outline" as const,
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
        className: "bg-green-500 text-white",
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
