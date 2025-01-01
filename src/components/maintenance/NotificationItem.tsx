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
      "p-4 border rounded-lg",
      priority === "high" ? "bg-red-50 border-red-200" :
      priority === "medium" ? "bg-yellow-50 border-yellow-200" :
      "bg-blue-50 border-blue-200"
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn(
          "h-5 w-5",
          priority === "high" ? "text-red-500" :
          priority === "medium" ? "text-yellow-500" :
          "text-blue-500"
        )} />
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{issue}</p>
          {deadline && (
            <p className="text-xs text-muted-foreground mt-2">
              Échéance: {new Date(deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};