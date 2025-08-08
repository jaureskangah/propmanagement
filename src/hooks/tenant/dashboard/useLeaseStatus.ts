
import { useMemo } from 'react';
import { parseDateSafe } from '@/lib/date';
import { differenceInCalendarDays, startOfDay } from 'date-fns';

export const useLeaseStatus = (leaseEnd?: string) => {
  return useMemo(() => {
    console.log("=== CALCULATING LEASE STATUS ===");
    console.log("Lease end date:", leaseEnd);
    
    if (!leaseEnd) {
      console.log("No lease end date provided");
      return { daysLeft: null, status: 'active' as const }; // Retourner null pour indiquer qu'on charge
    }

    const endDate = startOfDay(parseDateSafe(leaseEnd));
    const today = startOfDay(new Date());
    
    console.log("End date object:", endDate);
    console.log("Today date object:", today);
    
    const daysDifference = differenceInCalendarDays(endDate, today);
    
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
