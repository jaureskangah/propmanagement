
import { FinancialData } from "../types";
import { calculateTotalIncome, calculateTotalExpenses, calculateOccupancyRate, calculateUnpaidRent, calculateTrend } from "./calculationUtils";

interface DataParams {
  tenants: any[];
  payments: any[];
  maintenanceExpenses: any[];
  vendorInterventions: any[];
  property: any;
  prevData: any;
  selectedYear?: number;
}

/**
 * Creates default financial data
 */
export function createDefaultFinancialData(): FinancialData {
  return {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    occupancyRate: 0,
    unpaidRent: 0,
    incomeTrend: 0,
    expensesTrend: 0,
    occupancyRateTrend: 0,
    unpaidRentTrend: 0
  };
}

/**
 * Maps fetched data to FinancialData interface
 */
export function mapToFinancialData(params: DataParams): FinancialData {
  const {
    tenants,
    payments,
    maintenanceExpenses,
    vendorInterventions,
    property,
    prevData,
    selectedYear = new Date().getFullYear()
  } = params;

  // Current period calculations
  const totalIncome = calculateTotalIncome(payments);
  const totalExpenses = calculateTotalExpenses(maintenanceExpenses, vendorInterventions);
  const netIncome = totalIncome - totalExpenses;
  const occupancyRate = calculateOccupancyRate(tenants.length, property?.units || 0);
  
  // Get current month and year for unpaid rent calculation
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const unpaidRent = calculateUnpaidRent(tenants, payments, currentMonth, selectedYear);

  // Previous period calculations
  const prevTotalIncome = calculateTotalIncome(prevData.previousPayments);
  const prevTotalExpenses = calculateTotalExpenses(
    prevData.prevMaintenanceExpenses, 
    prevData.prevVendorInterventions
  );
  const prevOccupancyRate = calculateOccupancyRate(
    prevData.previousTenants.length, 
    property?.units || 0
  );
  
  // Previous unpaid rent calculation (for same month in previous year)
  const prevUnpaidRent = calculateUnpaidRent(
    prevData.previousTenants, 
    prevData.previousPayments, 
    currentMonth, 
    selectedYear - 1
  );

  // Calculate trends
  const incomeTrend = calculateTrend(totalIncome, prevTotalIncome);
  const expensesTrend = calculateTrend(totalExpenses, prevTotalExpenses);
  const occupancyRateTrend = calculateTrend(occupancyRate, prevOccupancyRate);
  const unpaidRentTrend = calculateTrend(unpaidRent, prevUnpaidRent);

  // Log
  console.log("Mapped financial metrics:", {
    totalIncome,
    totalExpenses,
    netIncome,
    occupancyRate,
    unpaidRent,
    incomeTrend,
    expensesTrend,
    occupancyRateTrend,
    unpaidRentTrend,
    selectedYear
  });

  return {
    totalIncome,
    totalExpenses,
    netIncome,
    occupancyRate,
    unpaidRent,
    incomeTrend,
    expensesTrend,
    occupancyRateTrend,
    unpaidRentTrend
  };
}
