import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenantNotifications } from '@/hooks/tenant/useTenantNotifications';

export const TenantNotificationBell = () => {
  const { unreadCount, clearNotifications } = useTenantNotifications();

  const handleClick = () => {
    clearNotifications();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative p-2 h-10 w-10 rounded-full hover:bg-accent"
      onClick={handleClick}
    >
      <motion.div
        animate={unreadCount > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
      >
        <Bell className="h-5 w-5" />
      </motion.div>
      
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <Badge 
            variant="destructive" 
            className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        </motion.div>
      )}
    </Button>
  );
};