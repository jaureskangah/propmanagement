
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
  return payments.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
}

/**
 * Calculates total expenses from maintenance and interventions
 */
export function calculateTotalExpenses(maintenanceExpenses: any[] = [], vendorInterventions: any[] = []): number {
  const maintenanceExpensesTotal = maintenanceExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount), 0) || 0;
  
  const vendorInterventionsTotal = vendorInterventions.reduce(
    (sum, intervention) => sum + Number(intervention.cost || 0), 0) || 0;
  
  return maintenanceExpensesTotal + vendorInterventionsTotal;
}

/**
 * Calculates occupancy rate
 */
export function calculateOccupancyRate(occupiedUnits: number, totalUnits: number): number {
  return totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
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
    (total, tenant) => total + Number(tenant.rent_amount || 0), 0) || 0;
  
  // Filter payments for current month
  const currentMonthPayments = payments.filter(payment => {
    if (!payment.payment_date) return false;
    const paymentDate = new Date(payment.payment_date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });
  
  // Paid amount for current month
  const currentMonthPaid = currentMonthPayments.reduce(
    (total, payment) => payment.status === 'paid' ? total + Number(payment.amount) : total, 
    0
  ) || 0;
  
  // Pending/overdue payments
  const pendingPayments = payments
    .filter(payment => payment.status === 'pending' || payment.status === 'overdue')
    .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
  
  // Unpaid rent calculation
  return Math.max(0, expectedRent - currentMonthPaid) + pendingPayments;
}
