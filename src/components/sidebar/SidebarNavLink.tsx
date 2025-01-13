import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

export const SidebarNavLink = ({ to, icon: Icon, label, isCollapsed }: SidebarNavLinkProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
          isActive 
            ? "bg-[#ea384c] text-white" 
            : "hover:bg-[#fde1d3] dark:hover:bg-[#ea384c]/20 hover:text-[#ea384c] dark:hover:text-white",
          isCollapsed && "justify-center px-2"
        )
      }
      title={label}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && label}
    </NavLink>
  );
};