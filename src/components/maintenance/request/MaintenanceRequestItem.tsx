
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequest } from "../types";

interface MaintenanceRequestItemProps {
  request: MaintenanceRequest;
  onClick: (request: MaintenanceRequest) => void;
}

export const MaintenanceRequestItem = ({ request, onClick }: MaintenanceRequestItemProps) => {
  const { t } = useLocale();

  return (
    <div
      key={request.id}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(request)}
    >
      <div className="flex items-center gap-3">
        <Wrench className="h-5 w-5 text-[#ea384c]" />
        <div>
          <p className="font-medium">{request.issue}</p>
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
        className={
          request.status === "Resolved"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-yellow-500 hover:bg-yellow-600"
        }
      >
        {request.status}
      </Badge>
    </div>
  );
};
