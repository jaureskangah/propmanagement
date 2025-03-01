
import { differenceInDays } from "date-fns";

export interface LeaseStatus {
  daysLeft: number;
  status: 'active' | 'expiring' | 'expired';
}

export const useLeaseStatus = (leaseEnd?: string) => {
  const calculateLeaseStatus = (endDate: string): LeaseStatus => {
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = differenceInDays(end, today);
    
    let status: 'active' | 'expiring' | 'expired';
    if (daysLeft < 0) {
      status = 'expired';
    } else if (daysLeft < 30) {
      status = 'expiring';
    } else {
      status = 'active';
    }

    return { daysLeft: Math.abs(daysLeft), status };
  };

  // Calculate status if leaseEnd is provided
  let status: LeaseStatus = { daysLeft: 0, status: 'active' };
  if (leaseEnd) {
    status = calculateLeaseStatus(leaseEnd);
  }

  return {
    calculateLeaseStatus,
    daysLeft: status.daysLeft,
    status: status.status
  };
};
