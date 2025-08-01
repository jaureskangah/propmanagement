import { MobileHeader } from './MobileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import ModernSidebar from '@/components/sidebar/ModernSidebar';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { useAuth } from '@/components/AuthProvider';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  isTenant?: boolean;
}

export const ResponsiveLayout = ({ children, title, className = '', isTenant }: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Determine if user is tenant from props or user metadata
  const isUserTenant = isTenant ?? user?.user_metadata?.is_tenant_user;

  return (
    <SidebarProvider>
      <ModernSidebar isTenant={isUserTenant} />
      <MobileHeader title={title} />
      <main className={`
        ${isMobile ? 'pt-14' : 'ml-20 pt-16 md:pt-8'} 
        transition-all duration-300 
        ${className}
      `}>
        {children}
      </main>
    </SidebarProvider>
  );
};