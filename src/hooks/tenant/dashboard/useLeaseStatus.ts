
import { useMemo } from 'react';
import { startOfDay, differenceInCalendarDays } from 'date-fns';
import { parseDateSafe } from '@/lib/date';

export const useLeaseStatus = (leaseEnd?: string) => {
  return useMemo(() => {
    console.log("=== CALCULATING LEASE STATUS ===");
    console.log("Lease end date:", leaseEnd);
    
    if (!leaseEnd) {
      console.log("No lease end date provided");
      return { daysLeft: null, status: 'active' as const }; // Retourner null pour indiquer qu'on charge
    }

    const end = startOfDay(parseDateSafe(leaseEnd));
    const today = startOfDay(new Date());
    
    console.log("End date (local start of day):", end);
    console.log("Today date (local start of day):", today);
    
    const daysDifference = differenceInCalendarDays(end, today);
    
    console.log("Days difference (calendar):", daysDifference);

    let status: 'active' | 'expiring' | 'expired';
    let daysLeft: number;

    if (daysDifference < 0) {
      status = 'expired';
      daysLeft = Math.abs(daysDifference); // Nombre de jours depuis l'expiration
      console.log("Status: EXPIRED -", daysLeft, "days ago");
    } else if (daysDifference <= 30) {
      status = 'expiring';
      daysLeft = daysDifference;
      console.log("Status: EXPIRING in", daysLeft, "days");
    } else {
      status = 'active';
      daysLeft = daysDifference;
      console.log("Status: ACTIVE -", daysLeft, "days remaining");
    }

    const result = { daysLeft, status };
    console.log("Final lease status result:", result);
    return result;
  }, [leaseEnd]);
};
