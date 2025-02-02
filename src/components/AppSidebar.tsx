import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LayoutDashboard, Home, Users, Wrench, MessageSquare, HelpCircle } from "lucide-react";
import { SidebarNavLink } from "./sidebar/SidebarNavLink";
import { SidebarLogo } from "./sidebar/SidebarLogo";
import { SidebarToggle } from "./sidebar/SidebarToggle";

interface AppSidebarProps {
  isTenant?: boolean;
}

const AppSidebar = ({ isTenant = false }: AppSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSupportClick = () => {
    // You can customize this to open a support modal, redirect to a support page, etc.
    window.open('mailto:contact@propmanagement.app', '_blank');
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed Position */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-white/50 backdrop-blur-sm">
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <div className="flex flex-col h-full">
              <div className="p-6">
                <SidebarLogo isCollapsed={false} />
              </div>
              <nav className="flex-1 px-4 pb-6">
                {!isTenant ? (
                  <>
                    <SidebarNavLink to="/dashboard" icon={LayoutDashboard}>
                      Dashboard
                    </SidebarNavLink>
                    <SidebarNavLink to="/properties" icon={Home}>
                      Properties
                    </SidebarNavLink>
                    <SidebarNavLink to="/tenants" icon={Users}>
                      Tenants
                    </SidebarNavLink>
                    <SidebarNavLink to="/maintenance" icon={Wrench}>
                      Maintenance
                    </SidebarNavLink>
                  </>
                ) : (
                  <>
                    <SidebarNavLink to="/tenant/maintenance" icon={Wrench}>
                      Maintenance
                    </SidebarNavLink>
                    <SidebarNavLink to="/tenant/communications" icon={MessageSquare}>
                      Communications
                    </SidebarNavLink>
                  </>
                )}
              </nav>
              <div className="p-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2" 
                  onClick={handleSupportClick}
                >
                  <HelpCircle className="h-4 w-4" />
                  Get Support
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex h-screen flex-col border-r bg-sidebar-background transition-all duration-300 ${
          isCollapsed ? "w-[80px]" : "w-[270px]"
        } fixed left-0 top-0`}
      >
        <div className="flex h-[60px] items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <SidebarLogo isCollapsed={isCollapsed} />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {!isTenant ? (
            <>
              <SidebarNavLink to="/dashboard" icon={LayoutDashboard} collapsed={isCollapsed}>
                Dashboard
              </SidebarNavLink>
              <SidebarNavLink to="/properties" icon={Home} collapsed={isCollapsed}>
                Properties
              </SidebarNavLink>
              <SidebarNavLink to="/tenants" icon={Users} collapsed={isCollapsed}>
                Tenants
              </SidebarNavLink>
              <SidebarNavLink to="/maintenance" icon={Wrench} collapsed={isCollapsed}>
                Maintenance
              </SidebarNavLink>
            </>
          ) : (
            <>
              <SidebarNavLink to="/tenant/maintenance" icon={Wrench} collapsed={isCollapsed}>
                Maintenance
              </SidebarNavLink>
              <SidebarNavLink
                to="/tenant/communications"
                icon={MessageSquare}
                collapsed={isCollapsed}
              >
                Communications
              </SidebarNavLink>
            </>
          )}
        </nav>

        <div className="border-t p-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            onClick={handleSupportClick}
            title={isCollapsed ? "Get Support" : undefined}
          >
            <HelpCircle className="h-4 w-4" />
            {!isCollapsed && "Get Support"}
          </Button>
          <div className="mt-2">
            <SidebarToggle isCollapsed={isCollapsed} onToggle={toggleCollapse} />
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`md:pl-[270px] min-h-screen transition-all duration-300 ${isCollapsed ? "md:pl-[80px]" : ""}`}>
        {/* Page content will be rendered here */}
      </div>
    </>
  );
};

export default AppSidebar;