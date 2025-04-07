
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import SidebarLinks from "./SidebarLinks";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarToggle } from "./SidebarToggle";

interface DesktopSidebarProps {
  isCollapsed: boolean;
  isTenant: boolean;
  handleSupportClick: () => void;
  toggleCollapse: () => void;
}

export const DesktopSidebar = ({
  isCollapsed,
  isTenant,
  handleSupportClick,
  toggleCollapse
}: DesktopSidebarProps) => {
  const { t } = useLocale();

  return (
    <aside
      className={cn(
        "hidden md:flex h-screen flex-col border-r bg-sidebar-background transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[270px]",
        "fixed left-0 top-0 z-30"
      )}
    >
      <div className="flex h-[60px] items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <SidebarLogo isCollapsed={isCollapsed} />
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <SidebarLinks isTenant={isTenant} collapsed={isCollapsed} />
      </nav>

      <div className={cn(
        "border-t p-4",
        isCollapsed ? "flex justify-center" : ""
      )}>
        <Button 
          variant="outline" 
          className={cn(
            "w-full justify-start gap-2 transition-colors",
            isCollapsed && "w-10 h-10 p-0 justify-center"
          )}
          onClick={handleSupportClick}
          title={isCollapsed ? t('getSupport') : undefined}
        >
          <HelpCircle className="h-4 w-4" />
          {!isCollapsed && t('getSupport')}
        </Button>
        <div className="mt-2">
          <SidebarToggle isCollapsed={isCollapsed} onToggle={toggleCollapse} />
        </div>
      </div>
    </aside>
  );
};
