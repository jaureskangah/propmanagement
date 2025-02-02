import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardHeaderProps {
  title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </div>
  );
}