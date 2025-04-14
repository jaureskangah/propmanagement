
// This file contains utility functions to process financial data for charts
import { format, parseISO } from 'date-fns';

// Cache for processed data to avoid redundant calculations
const dataCache = new Map();

// Helper to get month name
const getMonthName = (monthIndex: number): string => {
  return new Date(2023, monthIndex).toLocaleString('default', { month: 'short' });
};

/**
 * Process payment and expense data into monthly format for charts
 * With memoization to improve performance
 */
export const processMonthlyData = (payments = [], expenses = [], year: number) => {
  // Create cache key based on input data
  const cacheKey = `monthly-${year}-${payments.length}-${expenses.length}`;
  
  // Return cached result if available
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  // Initialize month data structure
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: getMonthName(i),
    income: 0,
    expense: 0,
    profit: 0,
  }));

  // Process payments
  payments.forEach((payment) => {
    if (payment.payment_date) {
      const date = parseISO(payment.payment_date);
      const month = date.getMonth();
      monthlyData[month].income += Number(payment.amount) || 0;
    }
  });

  // Process expenses
  expenses.forEach((expense) => {
    if (expense.date) {
      const date = parseISO(expense.date);
      const month = date.getMonth();
      // Handle both expense.amount (maintenance_expenses) and expense.cost (vendor_interventions)
      const expenseAmount = Number(expense.amount || expense.cost || 0);
      monthlyData[month].expense += expenseAmount;
    }
  });

  // Calculate profit for each month
  monthlyData.forEach((month) => {
    month.profit = month.income - month.expense;
  });

  // Cache the result
  dataCache.set(cacheKey, monthlyData);
  
  return monthlyData;
};

/**
 * Process payment and expense data into yearly format for charts
 * With memoization to improve performance
 */
export const processYearlyData = (payments = [], expenses = [], currentYear: number) => {
  // Create cache key based on input data
  const cacheKey = `yearly-${currentYear}-${payments.length}-${expenses.length}`;
  
  // Return cached result if available
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  // Get the previous 5 years including current year
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
  
  // Initialize yearly data structure
  const yearlyData = years.map(year => ({
    name: year.toString(),
    income: 0,
    expense: 0,
    profit: 0,
  }));

  // Create a map for faster lookup
  const yearDataMap = new Map(yearlyData.map(item => [item.name, item]));

  // Process payments
  payments.forEach((payment) => {
    if (payment.payment_date) {
      const date = parseISO(payment.payment_date);
      const year = date.getFullYear().toString();
      
      if (yearDataMap.has(year)) {
        const yearData = yearDataMap.get(year);
        yearData.income += Number(payment.amount) || 0;
      }
    }
  });

  // Process expenses
  expenses.forEach((expense) => {
    if (expense.date) {
      const date = parseISO(expense.date);
      const year = date.getFullYear().toString();
      
      if (yearDataMap.has(year)) {
        const yearData = yearDataMap.get(year);
        // Handle both expense.amount (maintenance_expenses) and expense.cost (vendor_interventions)
        const expenseAmount = Number(expense.amount || expense.cost || 0);
        yearData.expense += expenseAmount;
      }
    }
  });

  // Calculate profit and finalize data
  const result = years.map(year => {
    const yearStr = year.toString();
    const data = yearDataMap.get(yearStr);
    data.profit = data.income - data.expense;
    return data;
  });

  // Cache the result
  dataCache.set(cacheKey, result);
  
  return result;
};

// Clear cache when window loses focus to ensure fresh data on return
if (typeof window !== 'undefined') {
  window.addEventListener('blur', () => {
    dataCache.clear();
  });
}
