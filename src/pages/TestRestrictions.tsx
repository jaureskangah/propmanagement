import React from 'react';
import { PlanRestrictionsTest } from '@/components/testing/PlanRestrictionsTest';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

const TestRestrictions = () => {
  return (
    <ResponsiveLayout title="Test des Restrictions de Plan">
      <PlanRestrictionsTest />
    </ResponsiveLayout>
  );
};

export default TestRestrictions;