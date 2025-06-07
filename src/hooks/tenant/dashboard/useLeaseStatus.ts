
import { useMemo } from 'react';

export const useLeaseStatus = (leaseEnd?: string) => {
  return useMemo(() => {
    if (!leaseEnd) {
      return { daysLeft: 0, status: 'expired' as const };
    }

    const endDate = new Date(leaseEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'active' | 'expiring' | 'expired';
    let daysLeft: number;

    if (daysDifference < 0) {
      status = 'expired';
      daysLeft = Math.abs(daysDifference); // Nombre de jours depuis l'expiration
    } else if (daysDifference <= 30) {
      status = 'expiring';
      daysLeft = daysDifference;
    } else {
      status = 'active';
      daysLeft = daysDifference;
    }

    return { daysLeft, status };
  }, [leaseEnd]);
};
