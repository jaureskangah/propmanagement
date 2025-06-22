
import React, { useState, useMemo } from "react";
import AppSidebar from "@/components/AppSidebar";
import { InvitationsHeader } from "@/components/invitations/InvitationsHeader";
import { InvitationFilters } from "@/components/invitations/InvitationFilters";
import { InvitationsList } from "@/components/invitations/InvitationsList";
import { useInvitationManagement } from "@/hooks/invitations/useInvitationManagement";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/sidebar/ModernSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const InvitationsContent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  
  const {
    invitations,
    isLoading,
    sendingInvitations,
    handleResendInvitation,
    handleCancelInvitation,
    fetchInvitations
  } = useInvitationManagement();

  const invitationsCount = useMemo(() => {
    const isExpired = (invitation: any) => {
      return new Date(invitation.expires_at) < new Date();
    };

    return {
      all: invitations.length,
      pending: invitations.filter(inv => inv.status === 'pending' && !isExpired(inv)).length,
      expired: invitations.filter(inv => isExpired(inv) && inv.status === 'pending').length,
      completed: invitations.filter(inv => inv.status === 'accepted').length,
      cancelled: invitations.filter(inv => inv.status === 'cancelled').length,
    };
  }, [invitations]);

  return (
    <div className={cn(
      "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
      !isMobile && (open ? "md:ml-[270px]" : "md:ml-[80px]")
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

        <InvitationFilters 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          invitationsCount={invitationsCount}
        >
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
  );
};

const Invitations = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <InvitationsContent />
    </div>
  );
};

export default Invitations;
