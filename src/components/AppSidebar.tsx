
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { DesktopSidebar } from "./sidebar/DesktopSidebar";

interface AppSidebarProps {
  isTenant?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

const AppSidebar = ({ 
  isTenant = false,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed,
  isMobileOpen: externalIsMobileOpen,
  setIsMobileOpen: externalSetIsMobileOpen
}: AppSidebarProps) => {
  // Gestion interne ou externe de l'état de contraction
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [internalIsMobileOpen, setInternalIsMobileOpen] = useState(false);
  
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;
  
  const isMobileOpen = externalIsMobileOpen !== undefined ? externalIsMobileOpen : internalIsMobileOpen;
  const setIsMobileOpen = externalSetIsMobileOpen || setInternalIsMobileOpen;

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
    </>
  );
};

export default AppSidebar;
