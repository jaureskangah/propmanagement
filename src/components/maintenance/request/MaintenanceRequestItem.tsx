
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
    if (language === 'fr') {
      switch(status) {
        case "Resolved": return "Résolue";
        case "In Progress": return "En cours";
        case "Pending": return "En attente";
        default: return status;
      }
    }
    return status;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  // Function to get secondary info to display (tenant info or description)
  const getSecondaryInfo = () => {
    // Priority 1: Tenant information if available
    if (request.tenants) {
      const tenantInfo = [];
      
      // Add tenant name
      if (request.tenants.name) {
        tenantInfo.push(request.tenants.name);
      }
      
      // Add property and unit info
      const locationParts = [];
      if (request.tenants.properties?.name) {
        locationParts.push(request.tenants.properties.name);
      }
      if (request.tenants.unit_number) {
        locationParts.push(`${t("unit")} ${request.tenants.unit_number}`);
      }
      
      if (locationParts.length > 0) {
        tenantInfo.push(locationParts.join(', '));
      }
      
      return tenantInfo.join(' - ');
    }
    
    // Priority 2: Description if different from issue title
    if (request.description && request.description.trim() !== request.issue.trim()) {
      return request.description.length > 100 
        ? `${request.description.substring(0, 100)}...` 
        : request.description;
    }
    
    // Priority 3: Show creation date info if no other info available
    return `${t("createdOn")} ${formatDate(request.created_at)}`;
  };

  const secondaryInfo = getSecondaryInfo();

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
          {secondaryInfo && (
            <p className="text-sm text-muted-foreground mt-1">
              {secondaryInfo}
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
