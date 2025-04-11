
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface WorkOrderStatusProps {
  status: string;
}

export const WorkOrderStatus = ({ status }: WorkOrderStatusProps) => {
  const { t } = useLocale();
  
  const getStatusColor = () => {
    switch (status) {
      case "Completed":
      case "Terminé":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
      case "En cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Scheduled":
      case "Planifié":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex items-center">
      <Activity className="h-4 w-4 text-gray-500 mr-2" />
      <span className="text-sm font-medium text-gray-500 mr-2">{t('status')}:</span>
      <Badge className={`${getStatusColor()} font-medium`}>
        {status}
      </Badge>
    </div>
  );
};
