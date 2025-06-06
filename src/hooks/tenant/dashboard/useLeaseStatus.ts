
import { useMemo } from 'react';

export const useLeaseStatus = (leaseEnd?: string) => {
  return useMemo(() => {
    if (!leaseEnd) {
      return { daysLeft: 0, status: 'expired' as const };
    }

    const endDate = new Date(leaseEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'active' | 'expiring' | 'expired';
    if (daysLeft < 0) {
      status = 'expired';
    } else if (daysLeft <= 30) {
      status = 'expiring';
    } else {
      status = 'active';
    }

    return { daysLeft: Math.max(0, daysLeft), status };
  }, [leaseEnd]);
};
