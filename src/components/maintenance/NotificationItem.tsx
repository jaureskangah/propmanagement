import { AlertTriangle, Bell, CreditCard, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  title: string;
  issue: string;
  priority: string;
  deadline?: string;
  icon?: any;
}

export const NotificationItem = ({ title, issue, priority, deadline, icon: Icon = Bell }: NotificationItemProps) => {
  return (
    <div className={cn(
      "p-4 border rounded-lg transition-colors",
      priority === "high" ? "bg-red-950/50 border-red-800 dark:bg-red-950/20 dark:border-red-800/50" :
      priority === "medium" ? "bg-yellow-950/50 border-yellow-800 dark:bg-yellow-950/20 dark:border-yellow-800/50" :
      "bg-blue-950/50 border-blue-800 dark:bg-blue-950/20 dark:border-blue-800/50"
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn(
          "h-5 w-5",
          priority === "high" ? "text-red-400" :
          priority === "medium" ? "text-yellow-400" :
          "text-blue-400"
        )} />
        <div className="flex-1">
          <h4 className="font-medium text-sm text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{issue}</p>
          {deadline && (
            <p className="text-xs text-muted-foreground mt-2">
              Deadline: {new Date(deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};