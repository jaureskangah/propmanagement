
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, HelpCircle } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import SidebarLinks from "./SidebarLinks";
import { useLocale } from "@/components/providers/LocaleProvider";

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
            <nav className="flex-1 space-y-2 px-4 pb-6">
              <SidebarLinks isTenant={isTenant} />
            </nav>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2" 
                onClick={handleSupportClick}
              >
                <HelpCircle className="h-4 w-4" />
                {t('getSupport')}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
