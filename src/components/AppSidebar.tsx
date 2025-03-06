
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";

interface AppSidebarProps {
  isTenant?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const AppSidebar = ({ 
  isTenant = false,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed
}: AppSidebarProps) => {
  // Gestion interne ou externe de l'état de contraction
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSupportClick = () => {
    window.open('mailto:contact@propmanagement.app', '_blank');
  };

  return (
    <>
      <MobileSidebar 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isTenant={isTenant}
        handleSupportClick={handleSupportClick}
      />

      <DesktopSidebar 
        isCollapsed={isCollapsed}
        isTenant={isTenant}
        handleSupportClick={handleSupportClick}
        toggleCollapse={toggleCollapse}
      />

      <div 
        className={cn(
          "min-h-screen transition-all duration-300 bg-background",
          isCollapsed ? "md:pl-[80px]" : "md:pl-[270px]"
        )}
      >
        {/* Page content will be rendered here */}
      </div>
    </>
  );
};

export default AppSidebar;
