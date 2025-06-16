
import React, { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { InvitationsHeader } from "@/components/invitations/InvitationsHeader";
import { InvitationFilters } from "@/components/invitations/InvitationFilters";
import { InvitationsList } from "@/components/invitations/InvitationsList";
import { useInvitationManagement } from "@/hooks/invitations/useInvitationManagement";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Invitations = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    invitations,
    isLoading,
    sendingInvitations,
    handleResendInvitation,
    handleCancelInvitation,
    fetchInvitations
  } = useInvitationManagement();

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
          <InvitationsHeader 
            invitationsCount={invitations.length}
            onRefresh={fetchInvitations}
            isLoading={isLoading}
          />

          <InvitationFilters activeTab={activeTab} onTabChange={setActiveTab}>
            <InvitationsList
              invitations={invitations}
              isLoading={isLoading}
              activeTab={activeTab}
              sendingInvitations={sendingInvitations}
              onResendInvitation={handleResendInvitation}
              onCancelInvitation={handleCancelInvitation}
            />
          </InvitationFilters>
        </motion.div>
      </div>
    </div>
  );
};

export default Invitations;
