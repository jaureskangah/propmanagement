import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Building2, Home, Users, Wrench } from "lucide-react";

const AppSidebar = () => {
  return (
    <div className="min-h-screen w-64 bg-gray-100/40 border-r px-4 py-8">
      <div className="mb-8">
        <NavLink
          to="/"
          className="text-xl font-bold text-center block hover:text-[#ea384c] transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <Building2 className="h-8 w-8 text-[#ea384c]" />
            <span>PropManager</span>
          </div>
        </NavLink>
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10"
            )
          }
        >
          <Home className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/properties"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10"
            )
          }
        >
          <Building2 className="h-5 w-5" />
          Properties
        </NavLink>
        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10"
            )
          }
        >
          <Users className="h-5 w-5" />
          Tenants
        </NavLink>
        <NavLink
          to="/maintenance"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#d41f32] hover:text-white",
              isActive ? "bg-[#ea384c] text-white" : "hover:bg-[#ea384c]/10"
            )
          }
        >
          <Wrench className="h-5 w-5" />
          Maintenance
        </NavLink>
      </nav>
    </div>
  );
};

export default AppSidebar;