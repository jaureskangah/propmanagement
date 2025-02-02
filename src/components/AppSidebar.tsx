import { useState } from "react";
import { cn } from "@/lib/utils";
import { Building2, Home, Users, Wrench, MessageSquare, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarToggle } from "./sidebar/SidebarToggle";
import { SidebarNavLink } from "./sidebar/SidebarNavLink";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface AppSidebarProps {
  isTenant?: boolean;
}

const AppSidebar = ({ isTenant = false }: AppSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <SidebarLogo isCollapsed={isCollapsed} />
      <nav className="space-y-2">
        {isTenant ? (
          <>
            <SidebarNavLink 
              to="/tenant/maintenance" 
              icon={Wrench} 
              label="Maintenance" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/tenant/communications" 
              icon={MessageSquare} 
              label="Communications" 
              isCollapsed={isCollapsed} 
            />
          </>
        ) : (
          <>
            <SidebarNavLink 
              to="/dashboard" 
              icon={Home} 
              label="Dashboard" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/properties" 
              icon={Building2} 
              label="Properties" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/tenants" 
              icon={Users} 
              label="Tenants" 
              isCollapsed={isCollapsed} 
            />
            <SidebarNavLink 
              to="/maintenance" 
              icon={Wrench} 
              label="Maintenance" 
              isCollapsed={isCollapsed} 
            />
          </>
        )}
      </nav>

      <div className={cn(
        "absolute bottom-4",
        isCollapsed ? "left-1/2 -translate-x-1/2" : "left-4"
      )}>
        <ThemeToggle />
      </div>
    </>
  );

  // Version mobile avec Sheet
  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden fixed top-4 left-4 z-50"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[340px] p-0">
        <div className="h-full bg-background px-4 py-8">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );

  // Version desktop
  const DesktopSidebar = () => (
    <div className={cn(
      "relative min-h-screen border-r px-4 py-8 transition-all duration-300 hidden lg:block",
      isCollapsed ? "w-20" : "w-64",
      "bg-background"
    )}>
      <SidebarToggle 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <SidebarContent />
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default AppSidebar;