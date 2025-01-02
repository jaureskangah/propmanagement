import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2, Home, Users, Wrench, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative min-h-screen border-r px-4 py-8 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64",
      "bg-background"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-9 z-50 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeft className={cn(
          "h-4 w-4 transition-transform",
          isCollapsed ? "rotate-180" : ""
        )} />
      </Button>

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
            {!isCollapsed && <span>PropManager</span>}
          </div>
        </NavLink>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10",
              isCollapsed && "justify-center px-2"
            )
          }
          title="Dashboard"
        >
          <Home className="h-5 w-5" />
          {!isCollapsed && "Dashboard"}
        </NavLink>
        <NavLink
          to="/properties"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10",
              isCollapsed && "justify-center px-2"
            )
          }
          title="Properties"
        >
          <Building2 className="h-5 w-5" />
          {!isCollapsed && "Properties"}
        </NavLink>
        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10",
              isCollapsed && "justify-center px-2"
            )
          }
          title="Tenants"
        >
          <Users className="h-5 w-5" />
          {!isCollapsed && "Tenants"}
        </NavLink>
        <NavLink
          to="/maintenance"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10",
              isCollapsed && "justify-center px-2"
            )
          }
          title="Maintenance"
        >
          <Wrench className="h-5 w-5" />
          {!isCollapsed && "Maintenance"}
        </NavLink>
      </nav>

      <div className={cn(
        "absolute bottom-4",
        isCollapsed ? "left-1/2 -translate-x-1/2" : "left-4"
      )}>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default AppSidebar;