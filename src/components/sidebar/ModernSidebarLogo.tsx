
import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useSidebar } from "./ModernSidebar";

interface ModernSidebarLogoProps {
  onClick?: () => void;
}

export const ModernSidebarLogo = ({ onClick }: ModernSidebarLogoProps) => {
  const { open, animate } = useSidebar();
  
  return (
    <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
      <motion.div
        className="flex items-center gap-2 cursor-pointer hover:text-[#ea384c] transition-colors"
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Building2 className="h-8 w-8 text-[#ea384c] flex-shrink-0" />
        
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="text-xl font-bold whitespace-nowrap"
        >
          PropManagement
        </motion.span>
      </motion.div>
    </div>
  );
};

export const ModernSidebarLogoIcon = ({ onClick }: ModernSidebarLogoProps) => {
  return (
    <div className="flex items-center justify-center py-6 border-b border-sidebar-border">
      <motion.div
        className="cursor-pointer hover:text-[#ea384c] transition-colors"
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <Building2 className="h-8 w-8 text-[#ea384c]" />
      </motion.div>
    </div>
  );
};
