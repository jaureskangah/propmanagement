
import { useNavigate, useLocation } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useLocale } from "./providers/LocaleProvider";
import { ModernSidebar, SidebarBody, SidebarLink, useSidebar } from "./sidebar/ModernSidebar";
import { ModernSidebarLogo } from "./sidebar/ModernSidebarLogo";
import SidebarLinks from "./sidebar/SidebarLinks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AppSidebarProps {
  isTenant?: boolean;
}

const SidebarContent = ({ 
  isTenant = false 
}: { 
  isTenant?: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  
  const handleLogoClick = () => {
    navigate('/', { replace: true });
  };

  const handleSupportClick = () => {
    window.open('mailto:contact@propmanagement.app', '_blank');
  };

  return (
    <SidebarBody className="justify-between">
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <ModernSidebarLogo onClick={handleLogoClick} />
        
        <nav className="flex-1 space-y-2 p-4">
          <SidebarLinks 
            isTenant={isTenant} 
            tooltipEnabled={false}
            renderAsModernLinks={true}
          />
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarLink
                icon={<HelpCircle className="h-4 w-4" />}
                onClick={handleSupportClick}
              >
                {t('getSupport')}
              </SidebarLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Obtenir de l'aide et du support</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </SidebarBody>
  );
};

const AppSidebar = ({ 
  isTenant = false
}: AppSidebarProps) => {
  return (
    <ModernSidebar>
      <SidebarContent isTenant={isTenant} />
    </ModernSidebar>
  );
};

export default AppSidebar;
