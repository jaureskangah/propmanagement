import { MobileHeader } from './MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const ResponsiveLayout = ({ children, title, className = '' }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();

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