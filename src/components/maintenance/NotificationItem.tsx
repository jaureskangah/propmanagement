
import { AlertTriangle, Bell, AlertCircle, Info, CreditCard, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  title: string;
  issue: string;
  priority: string;
  deadline?: string;
  icon?: any;
}

export const NotificationItem = ({ title, issue, priority, deadline, icon: CustomIcon }: NotificationItemProps) => {
  const getIcon = () => {
    if (CustomIcon) return CustomIcon;
    
    switch (priority) {
      case "high":
        return AlertTriangle;
      case "medium":
        return AlertCircle;
      case "low":
        return Info;
      default:
        return Bell;
    }
  };
  
  const Icon = getIcon();
  
  return (
    <div className={cn(
      "p-4 border rounded-lg transition-all duration-200 hover:shadow-md",
      priority === "high" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/50" :
      priority === "medium" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800/50" :
      "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/50"
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn(
          "h-5 w-5 transition-colors",
          priority === "high" ? "text-red-500 dark:text-red-400" :
          priority === "medium" ? "text-yellow-500 dark:text-yellow-400" :
          "text-blue-500 dark:text-blue-400"
        )} />
        <div className="flex-1">
          <h4 className="font-medium text-sm text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{issue}</p>
          {deadline && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 inline-block" />
              Deadline: {new Date(deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
