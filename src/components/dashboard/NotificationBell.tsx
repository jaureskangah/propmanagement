import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  unreadCount: number;
}

export const NotificationBell = ({ unreadCount }: NotificationBellProps) => {
  if (unreadCount === 0) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute -top-12 right-0 h-12 w-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300",
        "border border-purple-100 hover:border-purple-200"
      )}
    >
      <Bell className="h-5 w-5 text-purple-600" />
      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 text-[11px] text-white flex items-center justify-center">
        {unreadCount}
      </span>
    </Button>
  );
};