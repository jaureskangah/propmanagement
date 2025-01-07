import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InviteTenantForm } from "./invite/InviteTenantForm";
import { useInvitationService } from "./invite/useInvitationService";

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
  const [email, setEmail] = useState(defaultEmail);
  const { isLoading, sendInvitation } = useInvitationService(tenantId, onClose);

  useEffect(() => {
    if (isOpen && defaultEmail) {
      console.log("Setting default email in dialog:", defaultEmail); // Ajout d'un log pour déboguer
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
          <DialogTitle>Invite Tenant to Communications</DialogTitle>
          <DialogDescription>
            Send an invitation to your tenant to join the communications platform.
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