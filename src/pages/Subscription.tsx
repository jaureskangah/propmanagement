import React from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';

const Subscription = () => {
  return (
    <ResponsiveLayout title="Abonnements">
      <SubscriptionManager />
    </ResponsiveLayout>
  );
};

export default Subscription;