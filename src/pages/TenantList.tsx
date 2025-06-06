
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { InviteTenantDialog } from "@/components/tenant/communications/InviteTenantDialog";
import { motion } from "framer-motion";

const TenantList = () => {
  const { t } = useLocale();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const handleInviteClick = () => {
    setIsInviteDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t('tenants')}
        </h1>
        <Button 
          variant="default" 
          onClick={handleInviteClick}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          {t('inviteTenant')}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-600 dark:text-gray-300">Tenant List Page</p>
      </div>

      {isInviteDialogOpen && (
        <InviteTenantDialog
          isOpen={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
          tenantId={selectedTenantId || "default-tenant-id"}
        />
      )}
    </motion.div>
  );
};

export default TenantList;
