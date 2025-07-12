import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InteractiveWidgetProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  actionLabel?: string;
  showAction?: boolean;
}

export const InteractiveWidget = ({
  children,
  onClick,
  href,
  className,
  actionLabel,
  showAction = true
}: InteractiveWidgetProps) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "hover:shadow-lg hover:border-primary/20 cursor-pointer transition-all duration-300",
        "dark:hover:border-primary/30 dark:bg-card/50 dark:backdrop-blur-sm",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative p-6 h-full">
        {children}
        
        {showAction && (actionLabel || onClick || href) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
          >
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
              {actionLabel || "Voir plus"}
              {href ? <ExternalLink className="h-3 w-3 ml-1" /> : <ArrowRight className="h-3 w-3 ml-1" />}
            </Button>
          </motion.div>
        )}
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};