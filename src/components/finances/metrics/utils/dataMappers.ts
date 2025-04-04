
import { FinancialData } from "../types";
import { 
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateOccupancyRate,
  calculateUnpaidRent,
  calculateTrend 
} from "./calculationUtils";

/**
 * Maps raw financial data to the required FinancialData format
 */
export function mapToFinancialData(data: {
  tenants: any[],
  payments: any[],
  maintenanceExpenses: any[],
  vendorInterventions: any[],
  property: any,
  prevData: {
    previousPayments: any[],
    prevMaintenanceExpenses: any[],
    prevVendorInterventions: any[],
    previousTenants: any[]
  }
}): FinancialData {
  const { 
    tenants, payments, maintenanceExpenses, vendorInterventions, property, 
    prevData: { previousPayments, prevMaintenanceExpenses, prevVendorInterventions, previousTenants } 
  } = data;

  // Current period calculations
  const totalIncome = calculateTotalIncome(payments);
  const totalExpenses = calculateTotalExpenses(maintenanceExpenses, vendorInterventions);
  
  const totalUnits = property?.units || 0;
  const occupiedUnits = new Set(tenants?.map(t => t.unit_number)).size;
  const occupancyRate = calculateOccupancyRate(occupiedUnits, totalUnits);
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const unpaidRent = calculateUnpaidRent(tenants, payments, currentMonth, currentYear);
  
  // Previous period calculations
  const prevTotalIncome = calculateTotalIncome(previousPayments);
  const prevTotalExpenses = calculateTotalExpenses(prevMaintenanceExpenses, prevVendorInterventions);
  
  const prevOccupiedUnits = previousTenants ? new Set(previousTenants.map(t => t.unit_number)).size : 0;
  const prevOccupancyRate = calculateOccupancyRate(prevOccupiedUnits, totalUnits);
  
  // Previous month's data isn't enough to calculate unpaid rent properly,
  // so we use a simple comparison of overdue/pending payments
  const prevUnpaidRent = previousPayments
    ?.filter(payment => payment.status === 'pending' || payment.status === 'overdue')
    .reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
  
  // Calculate trends
  const totalIncomeTrend = calculateTrend(totalIncome, prevTotalIncome);
  const totalExpensesTrend = calculateTrend(totalExpenses, prevTotalExpenses);
  const occupancyRateTrend = calculateTrend(occupancyRate, prevOccupancyRate);
  const unpaidRentTrend = calculateTrend(unpaidRent, prevUnpaidRent);
  
  // Debug logging
  console.log("Financial metrics calculated:", {
    totalIncome, prevTotalIncome, totalIncomeTrend,
    totalExpenses, prevTotalExpenses, totalExpensesTrend,
    occupancyRate, prevOccupancyRate, occupancyRateTrend,
    unpaidRent, prevUnpaidRent, unpaidRentTrend
  });
  
  return {
    totalIncome,
    totalExpenses,
    occupancyRate,
    unpaidRent,
    trends: {
      totalIncomeTrend,
      totalExpensesTrend,
      occupancyRateTrend,
      unpaidRentTrend
    }
  };
}

/**
 * Creates default financial data object
 */
export function createDefaultFinancialData(): FinancialData {
  return {
    totalIncome: 0,
    totalExpenses: 0,
    occupancyRate: 0,
    unpaidRent: 0,
    trends: {
      totalIncomeTrend: 0,
      totalExpensesTrend: 0,
      occupancyRateTrend: 0,
      unpaidRentTrend: 0
    }
  };
}
