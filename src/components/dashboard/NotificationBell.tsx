
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface NotificationBellProps {
  unreadCount: number;
}

export const NotificationBell = ({ unreadCount }: NotificationBellProps) => {
  const navigate = useNavigate();
  
  if (unreadCount === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -top-12 right-0 h-12 w-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300",
          "border border-purple-100 hover:border-purple-200"
        )}
        onClick={() => navigate('/tenants')}
      >
        <Bell className="h-5 w-5 text-purple-600" />
        <motion.span 
          initial={{ scale: 0.5 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: 3, repeatType: "reverse" }}
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 text-[11px] text-white flex items-center justify-center"
        >
          {unreadCount}
        </motion.span>
      </Button>
    </motion.div>
  );
};
