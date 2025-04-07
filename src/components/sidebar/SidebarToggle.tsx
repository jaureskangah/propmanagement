
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarToggle = ({ isCollapsed, onToggle }: SidebarToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute -right-3 top-9 z-50 rounded-full border bg-background"
      onClick={onToggle}
    >
      <ChevronLeft className={cn(
        "h-4 w-4 transition-transform",
        isCollapsed ? "rotate-180" : ""
      )} />
    </Button>
  );
};
