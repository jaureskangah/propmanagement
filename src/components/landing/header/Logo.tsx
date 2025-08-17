
import { Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface LogoProps {
  onClick?: () => void;
  scrolled: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ onClick, scrolled, variant = 'default', size = 'md' }: LogoProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Landing logo clicked - navigating to landing page");
    
    // Always navigate to landing page
    navigate('/', { replace: true });
  };

  const sizeClasses = {
    sm: { logo: 'h-6 w-6', text: 'text-lg' },
    md: { logo: 'h-8 w-8', text: 'text-xl' },
    lg: { logo: 'h-10 w-10', text: 'text-2xl' }
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
    x: [0, 2],
    y: [0, -2],
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const containerVariants = {
    hover: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (variant === 'minimal') {
    return (
      <motion.div 
        className="relative cursor-pointer"
        onClick={handleClick}
        variants={containerVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <motion.div variants={iconVariants}>
          <img 
            src="/lovable-uploads/65364ae9-e3c6-4f05-abfc-cda641b5e1b9.png" 
            alt="PropManagement Logo" 
            className={`${sizeClasses[size].logo} object-contain`}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex items-center gap-2 cursor-pointer group" 
      onClick={handleClick}
      variants={containerVariants}
      whileHover="hover"
      whileTap="tap"
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div variants={iconVariants}>
        <img 
          src="/lovable-uploads/65364ae9-e3c6-4f05-abfc-cda641b5e1b9.png" 
          alt="PropManagement Logo" 
          className={`${sizeClasses[size].logo} object-contain transition-all duration-300`}
        />
      </motion.div>
      
      {variant !== 'compact' && (
        <motion.span 
          className={`${sizeClasses[size].text} font-bold transition-all duration-300 ${
            scrolled 
              ? 'bg-gradient-to-r from-[#ea384c] to-[#d31c3f] bg-clip-text text-transparent' 
              : 'text-black group-hover:text-[#ea384c]'
          }`}
          whileHover={{ scale: 1.02 }}
        >
          PropManagement
        </motion.span>
      )}
    </motion.div>
  );
};
