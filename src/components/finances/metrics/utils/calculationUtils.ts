
/**
 * Calculates trend percentage between current and previous values
 */
export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Calculates total income from payments
 */
export function calculateTotalIncome(payments: any[] = []): number {
  const total = payments.reduce((sum, payment) => {
    const amount = Number(payment.amount) || 0;
    return sum + amount;
  }, 0);
  console.log("Calculated total income:", total, "from", payments.length, "payments");
  return total;
}

/**
 * Calculates total expenses from maintenance and interventions
 */
export function calculateTotalExpenses(maintenanceExpenses: any[] = [], vendorInterventions: any[] = []): number {
  const maintenanceExpensesTotal = maintenanceExpenses.reduce(
    (sum, expense) => {
      const amount = Number(expense.amount) || 0;
      return sum + amount;
    }, 0);
  
  const vendorInterventionsTotal = vendorInterventions.reduce(
    (sum, intervention) => {
      const cost = Number(intervention.cost) || 0;
      return sum + cost;
    }, 0);
  
  const total = maintenanceExpensesTotal + vendorInterventionsTotal;
  console.log("Calculated total expenses:", total, "(maintenance:", maintenanceExpensesTotal, "vendor:", vendorInterventionsTotal, ")");
  return total;
}

/**
 * Calculates occupancy rate
 */
export function calculateOccupancyRate(occupiedUnits: number, totalUnits: number): number {
  const rate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
  console.log("Calculated occupancy rate:", rate, "% (", occupiedUnits, "/", totalUnits, "units)");
  return rate;
}

/**
 * Calculates unpaid rent based on due dates vs actual payments
 * This approach is more accurate as it considers actual payment schedules
 */
export function calculateUnpaidRent(
  tenants: any[] = [], 
  payments: any[] = [], 
  currentMonth: number, 
  currentYear: number
): number {
  const currentDate = new Date(currentYear, currentMonth);
  let totalUnpaidRent = 0;

  // For each tenant, calculate their specific unpaid rent
  tenants.forEach(tenant => {
    const rentAmount = Number(tenant.rent_amount) || 0;
    if (rentAmount === 0) return;

    // Get lease period
    const leaseStart = new Date(tenant.lease_start);
    const leaseEnd = new Date(tenant.lease_end);
    
    // Check if tenant should be paying rent this month
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    // Skip if lease hasn't started yet or has already ended
    if (leaseEnd < monthStart || leaseStart > monthEnd) {
      return;
    }

    // Get all payments made by this tenant for the current month
    const tenantPaymentsCurrentMonth = payments.filter(payment => {
      if (payment.tenant_id !== tenant.id || !payment.payment_date) return false;
      
      const paymentDate = new Date(payment.payment_date);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear &&
             payment.status === 'paid';
    });

    // Calculate total paid amount for this tenant this month
    const totalPaidThisMonth = tenantPaymentsCurrentMonth.reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0), 
      0
    );

    // Check for overdue payments from previous months
    const overduePayments = payments.filter(payment => {
      if (payment.tenant_id !== tenant.id || !payment.payment_date) return false;
      
      const paymentDate = new Date(payment.payment_date);
      const paymentMonthYear = new Date(paymentDate.getFullYear(), paymentDate.getMonth());
      
      return paymentMonthYear < monthStart && 
             (payment.status === 'pending' || payment.status === 'overdue' || payment.status === 'late');
    });

    const totalOverdue = overduePayments.reduce(
      (sum, payment) => sum + (Number(payment.amount) || 0), 
      0
    );

    // Calculate unpaid rent for this tenant
    // Current month shortfall + overdue from previous months
    const currentMonthShortfall = Math.max(0, rentAmount - totalPaidThisMonth);
    const tenantUnpaidRent = currentMonthShortfall + totalOverdue;

    totalUnpaidRent += tenantUnpaidRent;

    // Detailed logging for each tenant
    if (tenantUnpaidRent > 0) {
      console.log(`Tenant ${tenant.name} unpaid rent:`, {
        rentAmount,
        totalPaidThisMonth,
        currentMonthShortfall,
        totalOverdue,
        tenantUnpaidRent
      });
    }
  });

  console.log("Improved unpaid rent calculation:", {
    totalUnpaidRent,
    currentMonth: currentMonth + 1, // Display 1-based month
    currentYear,
    activeTenantsCount: tenants.length,
    totalPaymentsCount: payments.length
  });

  return totalUnpaidRent;
}
