import { AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationItemProps {
  id: string;
  title: string;
  issue: string;
  priority: string;
  deadline?: string;
}

export const NotificationItem = ({
  id,
  title,
  issue,
  priority,
  deadline,
}: NotificationItemProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div
      key={id}
      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{title}</h4>
          <Badge className={getPriorityColor(priority)}>
            {priority}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{issue}</p>
        {deadline && (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <span className={isOverdue(deadline) ? "text-red-500" : "text-gray-600"}>
              {new Date(deadline).toLocaleDateString()}
            </span>
            {isOverdue(deadline) && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};