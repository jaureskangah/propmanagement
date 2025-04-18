
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequest } from "@/types/tenant";
import { Wrench, Calendar, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Resolved": return <CheckCircle className="h-4 w-4" />;
      case "In Progress": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Resolved": return "bg-green-500 hover:bg-green-600";
      case "In Progress": return "bg-blue-500 hover:bg-blue-600";
      default: return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  // Translate status for display
  const translateStatus = (status: string) => {
    switch(status) {
      case "Resolved": return t('resolved');
      case "In Progress": return t('inProgress');
      case "Pending": return t('pending');
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg cursor-pointer",
            "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
            request.priority === "Urgent" ? "border-red-200 dark:border-red-800" : ""
          )}
          onClick={() => onViewDetails(request)}
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className={cn(
              "rounded-full p-2",
              request.priority === "Urgent" ? "bg-red-50 dark:bg-red-900/20" : "bg-blue-50 dark:bg-blue-900/20"
            )}>
              <Wrench className={cn(
                "h-5 w-5",
                request.priority === "Urgent" ? "text-red-500" : "text-blue-500"
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{request.issue}</p>
                {request.priority === "Urgent" && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {t('urgent')}
                  </Badge>
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
              variant="secondary"
              className={cn(
                "flex items-center gap-1",
                getStatusColor(request.status)
              )}
            >
              {getStatusIcon(request.status)}
              {translateStatus(request.status)}
            </Badge>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
