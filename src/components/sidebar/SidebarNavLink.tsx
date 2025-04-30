
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarNavLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  collapsed?: boolean;
  tooltipContent?: string;
}

export const SidebarNavLink = ({ to, icon: Icon, children, collapsed, tooltipContent }: SidebarNavLinkProps) => {
  const link = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300",
          isActive 
            ? "bg-[#ea384c] text-white shadow-md" 
            : "hover:bg-[#fde1d3] dark:hover:bg-[#ea384c]/20 hover:text-[#ea384c] dark:hover:text-white",
          collapsed && "justify-center px-2"
        )
      }
      title={collapsed ? String(children) : undefined}
    >
      <Icon className={cn(
        "h-5 w-5 transition-transform duration-300",
        !collapsed && "group-hover:scale-110"
      )} />
      {!collapsed && <span className="font-medium">{children}</span>}
    </NavLink>
  );

  if (collapsed && tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {link}
          </TooltipTrigger>
          <TooltipContent side="right">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return link;
};
