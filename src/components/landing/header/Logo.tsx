
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface LogoProps {
  onClick: () => void;
  scrolled: boolean;
}

export const Logo = ({ onClick, scrolled }: LogoProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <motion.div 
      className="flex items-center gap-2 cursor-pointer" 
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Building2 className="h-8 w-8 text-[#ea384c]" />
      <span className={`text-xl font-bold ${scrolled ? 'bg-gradient-to-r from-[#ea384c] to-[#d31c3f] bg-clip-text text-transparent' : 'text-black'}`}>
        PropManagement
      </span>
    </motion.div>
  );
};
