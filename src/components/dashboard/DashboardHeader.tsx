
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardCustomization } from "./DashboardCustomization";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  trend?: {
    value: number;
    label?: string;
  };
}

export const DashboardHeader = ({ title, trend }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-6">
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm",
            trend.value >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {trend.value >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span>{trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label || "this month"}</span>
          </div>
        )}
        <DashboardCustomization />
        <ThemeToggle />
        <NotificationBell unreadCount={0} />
      </div>
    </div>
  );
};
