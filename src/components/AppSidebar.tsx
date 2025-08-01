
import ModernSidebar from "./sidebar/ModernSidebar";
import { SidebarProvider } from '@/contexts/SidebarContext';

interface AppSidebarProps {
  isTenant?: boolean;
}

const AppSidebar = ({ isTenant = false }: AppSidebarProps) => {
  console.log("🔍 AppSidebar: Rendering with SidebarProvider", { isTenant });
  
  return (
    <SidebarProvider>
      <ModernSidebar isTenant={isTenant} />
    </SidebarProvider>
  );
};

export default AppSidebar;
