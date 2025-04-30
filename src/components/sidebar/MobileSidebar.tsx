
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, HelpCircle } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import SidebarLinks from "./SidebarLinks";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MobileSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isTenant: boolean;
  handleSupportClick: () => void;
}

export const MobileSidebar = ({
  isMobileOpen,
  setIsMobileOpen,
  isTenant,
  handleSupportClick
}: MobileSidebarProps) => {
  const { t } = useLocale();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 pt-0">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <SidebarLogo isCollapsed={false} />
          </div>
          <nav className="flex-1 space-y-2 px-4 pb-6">
            <SidebarLinks isTenant={isTenant} tooltipEnabled={false} />
          </nav>
          <div className="p-4 border-t">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    onClick={handleSupportClick}
                  >
                    <HelpCircle className="h-4 w-4" />
                    {t('getSupport')}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Obtenir de l'aide et du support</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
