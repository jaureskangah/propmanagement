
import React from 'react';
import { motion } from 'framer-motion';
import AppSidebar from '@/components/AppSidebar';
import InvitationsDashboard from '@/components/tenant/invitations/InvitationsDashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const InvitationsPage = () => {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className={cn(
        "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold">Gestion des invitations</h1>
            <p className="text-muted-foreground">
              Suivez et gérez les invitations envoyées à vos locataires
            </p>
          </div>
          
          <InvitationsDashboard />
        </motion.div>
      </div>
    </div>
  );
};

export default InvitationsPage;
