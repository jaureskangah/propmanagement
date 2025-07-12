import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'none';
  delay?: number;
  staggerChildren?: boolean;
  className?: string;
}

const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 }
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },
  none: {
    initial: {},
    animate: {},
    transition: {}
  }
};

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  variant = 'fadeIn',
  delay = 0,
  staggerChildren = false,
  className,
  ...props
}) => {
  const variantConfig = variants[variant];
  
  const containerVariants = staggerChildren ? {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay
      }
    }
  } : {};

  return (
    <motion.div
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      transition={{ 
        ...variantConfig.transition, 
        delay: staggerChildren ? 0 : delay 
      }}
      variants={staggerChildren ? containerVariants : undefined}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MotionCard: React.FC<MotionWrapperProps> = ({
  children,
  className,
  ...props
}) => (
  <MotionWrapper
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1",
      className
    )}
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </MotionWrapper>
);

export const MotionButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  children,
  className,
  onClick,
  disabled,
  type = 'button',
}) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={cn("transition-all duration-200", className)}
  >
    {children}
  </motion.button>
);