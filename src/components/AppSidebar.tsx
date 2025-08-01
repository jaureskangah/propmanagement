
import ModernSidebar from "./sidebar/ModernSidebar";
import { SidebarProvider } from '@/contexts/SidebarContext';

interface AppSidebarProps {
  isTenant?: boolean;
}

const AppSidebar = ({ isTenant = false }: AppSidebarProps) => {
  return (
    <SidebarProvider>
      <ModernSidebar isTenant={isTenant} />
    </SidebarProvider>
  );
};

export default AppSidebar;
