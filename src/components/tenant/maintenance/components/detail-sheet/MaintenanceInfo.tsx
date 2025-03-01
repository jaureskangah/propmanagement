
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { MaintenanceRequest } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenancePhotoGallery } from "../MaintenancePhotoGallery";

interface MaintenanceInfoProps {
  request: MaintenanceRequest;
}

export const MaintenanceInfo = ({ request }: MaintenanceInfoProps) => {
  const { t } = useLocale();

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Resolved": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "In Progress": return <Clock className="h-5 w-5 text-blue-500" />;
      case "Pending": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return null;
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

  return (
    <div className="space-y-6">
      {/* Status and Priority */}
      <div className="flex flex-wrap gap-3">
        <Badge className={`${getStatusClass(request.status)} text-white`}>
          <span className="flex items-center gap-1">
            {getStatusIcon(request.status)} {request.status}
          </span>
        </Badge>
        <Badge className={`${getPriorityClass(request.priority)} text-white`}>
          {request.priority}
        </Badge>
      </div>

      {/* Description */}
      {request.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            {request.description}
          </p>
        </div>
      )}

      {/* Deadline if available */}
      {request.deadline && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">{t('deadline')}:</span> {formatDate(request.deadline)}
          </span>
        </div>
      )}

      {/* Photos Gallery */}
      {request.photos && request.photos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('maintenancePhotos')}</h3>
          <MaintenancePhotoGallery photos={request.photos} />
        </div>
      )}
    </div>
  );
};
