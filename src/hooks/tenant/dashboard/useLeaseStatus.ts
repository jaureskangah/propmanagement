
import { differenceInDays } from "date-fns";

export interface LeaseStatus {
  daysLeft: number;
  status: 'active' | 'expiring' | 'expired';
}

export const useLeaseStatus = () => {
  const calculateLeaseStatus = (leaseEnd: string): LeaseStatus => {
    const today = new Date();
    const endDate = new Date(leaseEnd);
    const daysLeft = differenceInDays(endDate, today);
    
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

  return {
    calculateLeaseStatus
  };
};
