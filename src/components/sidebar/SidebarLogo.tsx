
import { useNavigate } from "react-router-dom";
import { Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  const iconVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  const trendingAnimation = {
    x: [0, 1],
    y: [0, -1],
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const containerVariants = {
    hover: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="mt-4 mb-8">
      <motion.div
        onClick={handleLogoClick}
        className="text-xl font-bold text-center block hover:text-[#ea384c] transition-colors cursor-pointer group"
        variants={containerVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed ? "justify-center" : "justify-center"
        )}>
          <motion.div variants={iconVariants}>
            <img 
              src="/lovable-uploads/65364ae9-e3c6-4f05-abfc-cda641b5e1b9.png" 
              alt="PropManagement Logo" 
              className="h-8 w-8 object-contain transition-all duration-300"
            />
          </motion.div>
          
          {!isCollapsed && (
            <motion.span 
              className="transition-all duration-300 group-hover:text-[#ea384c]"
              whileHover={{ scale: 1.02 }}
            >
              PropManagement
            </motion.span>
          )}
        </div>
      </motion.div>
    </div>
  );
};
