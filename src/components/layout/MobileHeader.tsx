import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarContext } from '@/contexts/SidebarContext';

interface MobileHeaderProps {
  title?: string;
  className?: string;
}

export const MobileHeader = ({ title, className = '' }: MobileHeaderProps) => {
  const isMobile = useIsMobile();
  
  // Utilisation conditionnelle du contexte seulement si on est dans un SidebarProvider
  let setIsMobileOpen: ((open: boolean) => void) | undefined;
  
  try {
    const context = useSidebarContext();
    setIsMobileOpen = context.setIsMobileOpen;
  } catch (error) {
    // Si pas de SidebarProvider, on ignore simplement
    console.log("MobileHeader: No SidebarProvider found, header will be display-only");
  }

  if (!isMobile) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b h-14 flex items-center px-4 md:hidden ${className}`}>
      {setIsMobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          data-mobile-trigger
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      {title && (
        <h1 className="font-semibold text-lg truncate">{title}</h1>
      )}
    </header>
  );
};