import { MobileHeader } from './MobileHeader';
import { useSidebarContext } from '@/contexts/SidebarContext';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const ResponsiveLayout = ({ children, title, className = '' }: ResponsiveLayoutProps) => {
  const { isMobile } = useSidebarContext();

  return (
    <>
      <MobileHeader title={title} />
      <main className={`
        ${isMobile ? 'pt-14' : 'ml-20 pt-16 md:pt-8'} 
        transition-all duration-300 
        ${className}
      `}>
        {children}
      </main>
    </>
  );
};