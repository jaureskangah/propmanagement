
import { useMemo } from 'react';

export const useLeaseStatus = (leaseEnd?: string) => {
  return useMemo(() => {
    console.log("=== CALCULATING LEASE STATUS ===");
    console.log("Lease end date:", leaseEnd);
    
    if (!leaseEnd) {
      console.log("No lease end date provided");
      return { daysLeft: 0, status: 'active' as const }; // Retourner "active" par défaut plutôt qu'"expired"
    }

    const endDate = new Date(leaseEnd);
    const today = new Date();
    
    console.log("End date object:", endDate);
    console.log("Today date object:", today);
    
    const diffTime = endDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log("Time difference (ms):", diffTime);
    console.log("Days difference (calculated):", daysDifference);

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
