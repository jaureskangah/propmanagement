import { NavLink } from "react-router-dom";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLogoProps {
  isCollapsed: boolean;
}

export const SidebarLogo = ({ isCollapsed }: SidebarLogoProps) => {
  return (
    <div className="mb-8">
      <NavLink
        to="/"
        className="text-xl font-bold text-center block hover:text-[#ea384c] transition-colors"
      >
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed ? "justify-center" : "justify-center"
        )}>
          <Building2 className="h-8 w-8 text-[#ea384c]" />
          {!isCollapsed && <span>PropManagement</span>}
        </div>
      </NavLink>
    </div>
  );
};