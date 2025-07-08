
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ModernButtonProps {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'glass';
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function ModernButton({ 
  className, 
  isLoading = false, 
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}: ModernButtonProps) {
  const baseClasses = "w-full relative group/button h-10 rounded-lg transition-all duration-300 flex items-center justify-center font-medium text-sm";
  
  const variantClasses = {
    primary: "bg-white text-black hover:bg-white/90",
    secondary: "bg-white/5 text-white border border-white/10 hover:border-white/20 hover:bg-white/10",
    glass: "bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || disabled}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
      type={type}
      {...props}
    >
      {/* Button glow effect */}
      <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
      
      <div className="relative overflow-hidden w-full h-full flex items-center justify-center rounded-lg">
        {/* Loading animation background */}
        {isLoading && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
            animate={{ 
              x: ['-100%', '100%'],
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut", 
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        )}
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="button-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
