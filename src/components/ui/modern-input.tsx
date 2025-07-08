
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface ModernInputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  label?: string;
}

export function ModernInput({ 
  className, 
  type, 
  icon, 
  rightIcon, 
  onRightIconClick, 
  label,
  ...props 
}: ModernInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="relative"
      whileFocus={{ scale: 1.02 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <div className="relative flex items-center overflow-hidden rounded-lg group">
        {icon && (
          <div className={cn(
            "absolute left-3 transition-all duration-300",
            isFocused ? 'text-white' : 'text-white/40'
          )}>
            {icon}
          </div>
        )}
        
        <input
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 focus:bg-white/10 rounded-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
            icon ? "pl-10" : "pl-3",
            rightIcon ? "pr-10" : "pr-3",
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div 
            onClick={onRightIconClick}
            className="absolute right-3 cursor-pointer text-white/40 hover:text-white transition-colors duration-300"
          >
            {rightIcon}
          </div>
        )}
        
        {/* Input highlight effect */}
        {isFocused && (
          <motion.div 
            layoutId="input-highlight"
            className="absolute inset-0 bg-white/5 -z-10 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    </motion.div>
  );
}
