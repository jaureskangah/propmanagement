
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { NotificationRequest } from "./types";

interface MaintenanceNotificationItemProps {
  request: NotificationRequest;
  t: (key: string) => string;
}

export const MaintenanceNotificationItem = ({ request, t }: MaintenanceNotificationItemProps) => {
  const navigate = useNavigate();

  const handleMaintenanceClick = () => {
    navigate(`/maintenance?request=${request.id}`);
  };

  return (
    <DropdownMenuItem 
      key={request.id}
      className="cursor-pointer"
      onClick={handleMaintenanceClick}
    >
      <div className="flex flex-col w-full text-left px-3 py-2">
        <span className="font-medium text-xs">
          {request.tenants?.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {request.tenants?.properties?.name && `${request.tenants.properties.name}, `}
          {t("unit")} {request.tenants?.unit_number}
        </span>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-muted-foreground line-clamp-1">
            {request.issue}
          </span>
          <Badge 
            variant={request.priority === "Urgent" ? "destructive" : "outline"} 
            className="ml-1 text-[10px] h-4"
          >
            {request.priority}
          </Badge>
        </div>
      </div>
    </DropdownMenuItem>
  );
};
