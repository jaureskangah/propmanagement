
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
 * Calculates unpaid rent
 */
export function calculateUnpaidRent(
  tenants: any[] = [], 
  payments: any[] = [], 
  currentMonth: number, 
  currentYear: number
): number {
  // Expected rent for all tenants
  const expectedRent = tenants.reduce(
    (total, tenant) => {
      const rentAmount = Number(tenant.rent_amount) || 0;
      return total + rentAmount;
    }, 0);
  
  // Filter payments for current month
  const currentMonthPayments = payments.filter(payment => {
    if (!payment.payment_date) return false;
    const paymentDate = new Date(payment.payment_date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });
  
  // Paid amount for current month
  const currentMonthPaid = currentMonthPayments.reduce(
    (total, payment) => payment.status === 'paid' ? total + Number(payment.amount || 0) : total, 
    0
  );
  
  // Pending/overdue payments
  const pendingPayments = payments
    .filter(payment => payment.status === 'pending' || payment.status === 'overdue' || payment.status === 'late')
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  
  // Unpaid rent calculation
  const unpaidRent = Math.max(0, expectedRent - currentMonthPaid) + pendingPayments;
  
  console.log("Unpaid rent calculation:", {
    expectedRent,
    currentMonthPaid,
    pendingPayments,
    unpaidRent,
    currentMonth,
    currentYear,
    tenantsCount: tenants.length,
    paymentsCount: payments.length,
    currentMonthPaymentsCount: currentMonthPayments.length
  });
  
  return unpaidRent;
}
