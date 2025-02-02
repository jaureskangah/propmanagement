import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowUpRight } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
}

export const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-sm text-green-600">
          <ArrowUpRight className="h-4 w-4" />
          <span>+12% this month</span>
        </div>
        <ThemeToggle />
        <NotificationBell unreadCount={0} />
      </div>
    </div>
  );
};