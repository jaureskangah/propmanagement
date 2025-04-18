
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequest } from "../types";
import { Card } from "@/components/ui/card";

interface MaintenanceRequestItemProps {
  request: MaintenanceRequest;
  onClick: () => void;
}

export const MaintenanceRequestItem = ({ request, onClick }: MaintenanceRequestItemProps) => {
  const { t, language } = useLocale();
  
  const cardStyle = request.priority === "Urgent" 
    ? "border-red-300 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30" 
    : "border hover:bg-gray-50 dark:hover:bg-gray-800";

  const getBadgeStyle = (status: string) => {
    switch(status) {
      case "Resolved":
      case "Résolue":
        return "bg-green-500 hover:bg-green-600";
      case "In Progress":
      case "En cours":
        return "bg-blue-500 hover:bg-blue-600";
      case "Pending":
      case "En attente":
      default:
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  const translateStatus = (status: string) => {
    switch(status) {
      case "Resolved": return language === 'fr' ? "Résolue" : "Resolved";
      case "In Progress": return language === 'fr' ? "En cours" : "In Progress";
      case "Pending": return language === 'fr' ? "En attente" : "Pending";
      default: return status;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  // Get a truncated version of the description
  const truncatedDescription = request.description 
    ? request.description.length > 100 
      ? `${request.description.substring(0, 100)}...` 
      : request.description
    : "";

  return (
    <Card
      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${cardStyle} font-sans`}
      onClick={handleClick}
      data-request-id={request.id}
      tabIndex={0}
      role="button"
      aria-label={`Open maintenance request: ${request.issue}`}
    >
      <div className="flex items-center gap-3">
        <Wrench className="h-5 w-5 text-[#ea384c]" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {request.issue}
            </p>
            {request.priority === "Urgent" && (
              <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
            )}
          </div>
          {truncatedDescription && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {truncatedDescription}
            </p>
          )}
          {request.tenants && (
            <p className="text-sm text-muted-foreground">
              {t("from")} {request.tenants.name} - 
              {request.tenants.properties?.name && ` ${request.tenants.properties.name}, `}
              {request.tenants.unit_number && `${t("unit")} ${request.tenants.unit_number}`}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {t("createdOn")} {formatDate(request.created_at)}
          </p>
        </div>
      </div>
      <Badge
        variant={request.status === "Resolved" ? "default" : "secondary"}
        className={`${getBadgeStyle(request.status)} font-sans text-xs`}
      >
        {translateStatus(request.status)}
      </Badge>
    </Card>
  );
};
