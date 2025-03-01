
import { MaintenanceRequest } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Eye, Clock, AlertCircle, CheckCircle, Star } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Resolved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "In Progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "Pending": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Wrench className="h-4 w-4" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case "Urgent": return "bg-red-500 hover:bg-red-600";
      case "High": return "bg-orange-500 hover:bg-orange-600";
      case "Medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "Low": return "bg-green-500 hover:bg-green-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case "Resolved": return "bg-green-500 hover:bg-green-600";
      case "In Progress": return "bg-blue-500 hover:bg-blue-600";
      case "Pending": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg dark:border-gray-700">
        <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {t('noMaintenanceRequests')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const daysSinceCreation = Math.floor((new Date().getTime() - new Date(request.created_at).getTime()) / (1000 * 3600 * 24));
        return (
          <div
            key={request.id}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg 
              ${!request.tenant_notified 
                ? 'bg-yellow-50 dark:bg-yellow-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }
              dark:border-gray-700 dark:text-white transition-colors`}
          >
            <div className="flex items-start gap-3 mb-3 sm:mb-0">
              <div className="mt-1">{getStatusIcon(request.status)}</div>
              <div>
                <p className="font-medium text-foreground dark:text-gray-100">{request.issue}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    {t('createdOn')} {formatDate(request.created_at)}
                    {daysSinceCreation > 0 && ` (${daysSinceCreation} ${t('daysAgo')})`}
                  </p>
                  <Badge className={`${getPriorityClass(request.priority)} text-white text-xs`}>
                    {request.priority}
                  </Badge>
                  {request.tenant_rating ? (
                    <div className="flex items-center text-xs text-yellow-500">
                      <Star className="h-3 w-3 fill-yellow-500 mr-1" />
                      {request.tenant_rating}/5
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`${getStatusClass(request.status)} text-white`}
              >
                {request.status}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(request)}
                className="mt-2 sm:mt-0"
              >
                <Eye className="h-4 w-4 mr-1" />
                {t('viewDetails')}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
