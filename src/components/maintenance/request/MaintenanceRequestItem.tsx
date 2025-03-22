
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequest } from "../types";

interface MaintenanceRequestItemProps {
  request: MaintenanceRequest;
  onClick: (request: MaintenanceRequest) => void;
}

export const MaintenanceRequestItem = ({ request, onClick }: MaintenanceRequestItemProps) => {
  const { t } = useLocale();

  // Déterminer le style de la carte en fonction de la priorité
  const cardStyle = request.priority === "Urgent" 
    ? "border-red-300 bg-red-50 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30" 
    : "border hover:bg-gray-50 dark:hover:bg-gray-800";

  // Déterminer le style de badge en fonction du statut
  const getBadgeStyle = (status: string) => {
    switch(status) {
      case "Resolved":
        return "bg-green-500 hover:bg-green-600";
      case "In Progress":
        return "bg-blue-500 hover:bg-blue-600";
      case "Pending":
      default:
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  return (
    <div
      key={request.id}
      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${cardStyle}`}
      onClick={() => onClick(request)}
    >
      <div className="flex items-center gap-3">
        <Wrench className="h-5 w-5 text-[#ea384c]" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{request.issue}</p>
            {request.priority === "Urgent" && (
              <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
            )}
          </div>
          {request.tenants && (
            <p className="text-sm text-muted-foreground">
              {t("from")} {request.tenants.name} - {request.tenants.properties?.name}, {t("unit")} {request.tenants.unit_number}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {t("createdOn")} {formatDate(request.created_at)}
          </p>
        </div>
      </div>
      <Badge
        variant={request.status === "Resolved" ? "default" : "secondary"}
        className={getBadgeStyle(request.status)}
      >
        {request.status}
      </Badge>
    </div>
  );
};
