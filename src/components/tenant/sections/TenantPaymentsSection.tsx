import React from 'react';
import { motion } from 'framer-motion';
import { TenantPayments } from '../TenantPayments';

interface TenantPaymentsSectionProps {
  tenantId: string;
  onPaymentUpdate: () => void;
}

export const TenantPaymentsSection = ({
  tenantId,
  onPaymentUpdate
}: TenantPaymentsSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <TenantPayments
        tenantId={tenantId}
        onPaymentUpdate={onPaymentUpdate}
      />
    </motion.div>
  );
};