
import { MaintenanceRequest } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

interface MaintenanceListProps {
  requests: MaintenanceRequest[];
  onMaintenanceUpdate: () => void;
}

export const MaintenanceList = ({ 
  requests,
  onMaintenanceUpdate 
}: MaintenanceListProps) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg dark:border-gray-700">
        <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No maintenance requests found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className={`flex items-center justify-between p-4 border rounded-lg 
            ${!request.tenant_notified 
              ? 'bg-yellow-50 dark:bg-yellow-900/20' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            dark:border-gray-700 dark:text-white transition-colors`}
        >
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-[#ea384c] dark:text-[#ff6b7d]" />
            <div>
              <p className="font-medium text-foreground dark:text-gray-100">{request.issue}</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Created on {formatDate(request.created_at)}
              </p>
            </div>
          </div>
          <Badge
            variant={request.status === "Resolved" ? "default" : "secondary"}
            className={
              request.status === "Resolved"
                ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                : "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
            }
          >
            {request.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};
