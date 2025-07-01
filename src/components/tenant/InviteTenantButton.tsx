
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { InviteTenantDialog } from './communications/InviteTenantDialog';

interface InviteTenantButtonProps {
  tenantId: string;
  tenantEmail?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

export const InviteTenantButton = ({
  tenantId,
  tenantEmail = '',
  size = 'sm',
  variant = 'outline',
  className = ''
}: InviteTenantButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
        className={`flex items-center gap-2 ${className}`}
      >
        <UserPlus className="h-4 w-4" />
        Inviter
      </Button>

      <InviteTenantDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        tenantId={tenantId}
        defaultEmail={tenantEmail}
      />
    </>
  );
};
