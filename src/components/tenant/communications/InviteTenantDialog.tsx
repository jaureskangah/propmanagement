
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InviteTenantForm } from "./invite/InviteTenantForm";
import { useInvitationService } from "./invite/useInvitationService";
import { useLocale } from "@/components/providers/LocaleProvider";

interface InviteTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  defaultEmail?: string;
}

export const InviteTenantDialog = ({
  isOpen,
  onClose,
  tenantId,
  defaultEmail = ""
}: InviteTenantDialogProps) => {
  const { t } = useLocale();
  const [email, setEmail] = useState(defaultEmail);
  const { isLoading, sendInvitation } = useInvitationService(tenantId, onClose);

  useEffect(() => {
    if (isOpen && defaultEmail) {
      setEmail(defaultEmail);
    }
  }, [isOpen, defaultEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendInvitation(email);
    if (success) {
      setEmail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('inviteTenant')}</DialogTitle>
          <DialogDescription>
            {t('inviteTenantDescription')}
          </DialogDescription>
        </DialogHeader>

        <InviteTenantForm
          email={email}
          isLoading={isLoading}
          onEmailChange={setEmail}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
