
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InviteTenantForm } from "./invite/InviteTenantForm";
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

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter un locataire</DialogTitle>
          <DialogDescription>
            Envoyez une invitation pour créer un compte locataire
          </DialogDescription>
        </DialogHeader>

        <InviteTenantForm
          tenantId={tenantId}
          defaultEmail={defaultEmail}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
