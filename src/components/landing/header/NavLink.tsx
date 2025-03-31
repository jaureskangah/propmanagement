
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NavLinkProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  scrolled?: boolean;
}

export const NavLink = ({ icon, label, onClick, scrolled }: NavLinkProps) => {
  return (
    <motion.div 
      className={`flex items-center gap-1 text-slate-600 hover:text-[#ea384c] transition-colors cursor-pointer font-medium ${scrolled ? 'text-slate-700' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  );
};
