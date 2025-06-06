
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLogoProps {
  isCollapsed: boolean;
}

export const SidebarLogo = ({ isCollapsed }: SidebarLogoProps) => {
  const navigate = useNavigate();
  
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Sidebar logo clicked - navigating to landing page");
    
    try {
      // Navigate to landing page
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Logo navigation error:", error);
    }
  };
  
  return (
    <div className="mt-4 mb-8">
      <div
        onClick={handleLogoClick}
        className="text-xl font-bold text-center block hover:text-[#ea384c] transition-colors cursor-pointer"
      >
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed ? "justify-center" : "justify-center"
        )}>
          <Building2 className="h-8 w-8 text-[#ea384c]" />
          {!isCollapsed && <span>PropManagement</span>}
        </div>
      </div>
    </div>
  );
};
