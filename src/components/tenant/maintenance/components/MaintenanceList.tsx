
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequest } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MaintenanceListProps {
  requests: MaintenanceRequest[];
  onMaintenanceUpdate: () => void;
  onViewDetails: (request: MaintenanceRequest) => void;
}

export const MaintenanceList = ({
  requests,
  onMaintenanceUpdate,
  onViewDetails
}: MaintenanceListProps) => {
  const { t } = useLocale();

  // Ajoutons des logs pour vérifier que les demandes sont bien triées
  console.log("MaintenanceList rendered with requests:", 
    requests.map(r => ({ id: r.id, issue: r.issue, created_at: r.created_at }))
  );

  if (requests.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center">
        <Wrench className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">{t('noMaintenanceRequests')}</h3>
        <p className="text-muted-foreground mt-2">
          {t('createNewRequestToSee')}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={() => onViewDetails(request)}
        >
          <div className="flex items-start sm:items-center gap-3">
            <Wrench className="h-5 w-5 text-[#ea384c] mt-1 sm:mt-0" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{request.issue}</p>
                {request.priority === "Urgent" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {t('createdOn')} {formatDate(request.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <Badge
              variant={request.status === "Resolved" ? "default" : "secondary"}
              className={
                request.status === "Resolved"
                  ? "bg-green-500 hover:bg-green-600"
                  : request.status === "In Progress"
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : "bg-yellow-500 hover:bg-yellow-600"
              }
            >
              {request.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
