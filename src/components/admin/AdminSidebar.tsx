import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import { 
  Settings,
  Monitor,
  BookOpen,
  Rocket,
  TestTube,
  Home,
  Factory
} from 'lucide-react';

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const adminPages = [
    { 
      to: "/dashboard", 
      label: "Tableau de bord", 
      icon: Home,
      description: "Vue d'ensemble" 
    },
    { 
      to: "/production-dashboard", 
      label: "Production", 
      icon: Settings,
      description: "Vérification production" 
    },
    { 
      to: "/monitoring", 
      label: "Surveillance", 
      icon: Monitor,
      description: "Surveillance temps réel" 
    },
    { 
      to: "/documentation", 
      label: "Documentation", 
      icon: BookOpen,
      description: "Documentation complète" 
    },
    { 
      to: "/go-live", 
      label: "Déploiement", 
      icon: Rocket,
      description: "Préparation déploiement" 
    },
    { 
      to: "/test-restrictions", 
      label: "Tests", 
      icon: TestTube,
      description: "Tests de restrictions" 
    }
  ];

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Factory className="mr-2 h-4 w-4" />
            {!isCollapsed && <span>Administration</span>}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {adminPages.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.to} 
                      className={getNavCls({ isActive: isActive(item.to) })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && (
                        <div>
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};