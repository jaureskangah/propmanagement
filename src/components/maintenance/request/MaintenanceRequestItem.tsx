
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
  
  console.log("MaintenanceRequestItem received request:", {
    id: request.id,
    issue: request.issue,
    description: request.description,
    tenants: request.tenants,
    tenant_id: request.tenant_id
  });
  
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
    // Check if we have tenant data from the nested structure
    if (request.tenants && typeof request.tenants === 'object') {
      const tenant = request.tenants;
      const tenantInfo = [];
      
      // Add tenant name
      if (tenant.name) {
        tenantInfo.push(tenant.name);
      }
      
      // Add property and unit info
      const locationParts = [];
      if (tenant.properties?.name) {
        locationParts.push(tenant.properties.name);
      }
      if (tenant.unit_number) {
        locationParts.push(`${t("unit")} ${tenant.unit_number}`);
      }
      
      if (locationParts.length > 0) {
        tenantInfo.push(locationParts.join(', '));
      }
      
      if (tenantInfo.length > 0) {
        console.log("Returning tenant info:", tenantInfo.join(' - '));
        return tenantInfo.join(' - ');
      }
    }
    
    // Fallback to description if available and different from issue title
    if (request.description && request.description.trim() !== request.issue.trim() && request.description.trim() !== '') {
      const desc = request.description.length > 100 
        ? `${request.description.substring(0, 100)}...` 
        : request.description;
      console.log("Returning description:", desc);
      return desc;
    }
    
    // Final fallback: Show creation date
    const fallback = `${t("createdOn")} ${formatDate(request.created_at, language)}`;
    console.log("Returning fallback date:", fallback);
    return fallback;
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
          <p className="text-sm text-muted-foreground mt-1">
            {secondaryInfo}
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
