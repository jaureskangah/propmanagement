
import React from "react";
import { Mail } from "lucide-react";
import { InvitationCard } from "./InvitationCard";
import { useLocale } from "@/components/providers/LocaleProvider";

type Invitation = {
  id: string;
  email: string;
  tenant_id: string;
  status: string;
  created_at: string;
  expires_at: string;
  tenant_name?: string;
  property_name?: string;
}

interface InvitationsListProps {
  invitations: Invitation[];
  isLoading: boolean;
  activeTab: string;
  sendingInvitations: Set<string>;
  onResendInvitation: (invitation: Invitation) => void;
  onCancelInvitation: (invitation: Invitation) => void;
}

export const InvitationsList = ({
  invitations,
  isLoading,
  activeTab,
  sendingInvitations,
  onResendInvitation,
  onCancelInvitation
}: InvitationsListProps) => {
  const { t } = useLocale();
  const isExpired = (invitation: Invitation) => {
    return new Date(invitation.expires_at) < new Date();
  };

  const filteredInvitations = () => {
    switch (activeTab) {
      case 'pending':
        return invitations.filter(inv => inv.status === 'pending' && !isExpired(inv));
      case 'expired':
        return invitations.filter(inv => isExpired(inv) && inv.status === 'pending');
      case 'cancelled':
        return invitations.filter(inv => inv.status === 'cancelled');
      case 'completed':
        return invitations.filter(inv => inv.status === 'accepted');
      default:
        return invitations;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredInvitations().length === 0) {
    return (
      <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center h-64">
        <Mail className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{t('noInvitation')}</h3>
        <p className="text-muted-foreground text-center mt-1">
          {activeTab !== 'all' ? t('noInvitationInCategory') : t('noInvitation')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredInvitations().map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          onResend={onResendInvitation}
          onCancel={onCancelInvitation}
          isResending={sendingInvitations.has(invitation.id)}
        />
      ))}
    </div>
  );
};
