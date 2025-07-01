
import React, { useState, useMemo } from "react";
import { InvitationsHeader } from "@/components/invitations/InvitationsHeader";
import { InvitationFilters } from "@/components/invitations/InvitationFilters";
import { InvitationsList } from "@/components/invitations/InvitationsList";
import { useInvitationManagement } from "@/hooks/invitations/useInvitationManagement";
import { motion } from "framer-motion";

const Invitations = () => {
  const [activeTab, setActiveTab] = useState('all');
  
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
    <div className="min-h-screen bg-background">
      <div className="p-6 md:p-8">
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
    </div>
  );
};

export default Invitations;
