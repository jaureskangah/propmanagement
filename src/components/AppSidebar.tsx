
import ModernSidebar from "./sidebar/ModernSidebar";

interface AppSidebarProps {
  isTenant?: boolean;
}

const AppSidebar = ({ isTenant = false }: AppSidebarProps) => {
  return <ModernSidebar isTenant={isTenant} />;
};

export default AppSidebar;
