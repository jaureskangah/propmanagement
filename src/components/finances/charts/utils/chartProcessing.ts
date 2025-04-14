
// This file contains utility functions to process financial data for charts
import { format, parseISO } from 'date-fns';

// Cache for processed data to avoid redundant calculations
const dataCache = new Map();

// Maximum age for cached data in milliseconds (5 minutes)
const CACHE_MAX_AGE = 5 * 60 * 1000;

// Cache timestamp tracker
const cacheTimestamps = new Map();

// Helper to get month name
const getMonthName = (monthIndex: number): string => {
  return new Date(2023, monthIndex).toLocaleString('default', { month: 'short' });
};

/**
 * Validate a numerical value and provide a safe default
 */
const safeNumber = (value: any, defaultValue = 0): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Safely parse a date string, returning null if invalid
 */
const safeParseDate = (dateString: string): Date | null => {
  try {
    if (!dateString) return null;
    const date = parseISO(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (e) {
    console.error("Date parsing error:", e);
    return null;
  }
};

/**
 * Process payment and expense data into monthly format for charts
 * With memoization to improve performance
 */
export const processMonthlyData = (payments = [], expenses = [], year: number) => {
  // Validate inputs to prevent potential security issues
  if (!Array.isArray(payments)) payments = [];
  if (!Array.isArray(expenses)) expenses = [];
  if (typeof year !== 'number' || year < 2000 || year > 2100) {
    year = new Date().getFullYear();
  }

  // Create cache key based on input data
  const cacheKey = `monthly-${year}-${payments.length}-${expenses.length}`;
  
  // Check cache age
  const cacheTime = cacheTimestamps.get(cacheKey);
  const isValidCache = cacheTime && (Date.now() - cacheTime < CACHE_MAX_AGE);
  
  // Return cached result if available and not expired
  if (isValidCache && dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey);
  }
  
  // Initialize month data structure
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: getMonthName(i),
    income: 0,
    expense: 0,
    profit: 0,
  }));

  // Process payments with validation
  payments.forEach((payment) => {
    const date = safeParseDate(payment.payment_date);
    if (date) {
      const month = date.getMonth();
      const amount = safeNumber(payment.amount);
      if (month >= 0 && month < 12) {
        monthlyData[month].income += amount;
      }
    }
  });

  // Process expenses with validation
  expenses.forEach((expense) => {
    const date = safeParseDate(expense.date);
    if (date) {
      const month = date.getMonth();
      // Handle both expense.amount (maintenance_expenses) and expense.cost (vendor_interventions)
      const expenseAmount = safeNumber(expense.amount || expense.cost);
      if (month >= 0 && month < 12) {
        monthlyData[month].expense += expenseAmount;
      }
    }
  });

  // Calculate profit for each month
  monthlyData.forEach((month) => {
    month.profit = month.income - month.expense;
  });

  // Cache the result with timestamp
  dataCache.set(cacheKey, monthlyData);
  cacheTimestamps.set(cacheKey, Date.now());
  
  return monthlyData;
};

/**
 * Process payment and expense data into yearly format for charts
 * With memoization to improve performance
 */
export const processYearlyData = (payments = [], expenses = [], currentYear: number) => {
  // Validate inputs to prevent potential security issues
  if (!Array.isArray(payments)) payments = [];
  if (!Array.isArray(expenses)) expenses = [];
  if (typeof currentYear !== 'number' || currentYear < 2000 || currentYear > 2100) {
    currentYear = new Date().getFullYear();
  }
  
  // Create cache key based on input data
  const cacheKey = `yearly-${currentYear}-${payments.length}-${expenses.length}`;
  
  // Check cache age
  const cacheTime = cacheTimestamps.get(cacheKey);
  const isValidCache = cacheTime && (Date.now() - cacheTime < CACHE_MAX_AGE);
  
  // Return cached result if available and not expired
  if (isValidCache && dataCache.has(cacheKey)) {
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

  // Process payments with validation
  payments.forEach((payment) => {
    const date = safeParseDate(payment.payment_date);
    if (date) {
      const year = date.getFullYear().toString();
      const amount = safeNumber(payment.amount);
      
      if (yearDataMap.has(year)) {
        const yearData = yearDataMap.get(year);
        yearData.income += amount;
      }
    }
  });

  // Process expenses with validation
  expenses.forEach((expense) => {
    const date = safeParseDate(expense.date);
    if (date) {
      const year = date.getFullYear().toString();
      
      if (yearDataMap.has(year)) {
        const yearData = yearDataMap.get(year);
        // Handle both expense.amount (maintenance_expenses) and expense.cost (vendor_interventions)
        const expenseAmount = safeNumber(expense.amount || expense.cost);
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

  // Cache the result with timestamp
  dataCache.set(cacheKey, result);
  cacheTimestamps.set(cacheKey, Date.now());
  
  return result;
};

// Clear cache periodically to ensure fresh data (every 5 minutes)
if (typeof window !== 'undefined') {
  // Clear on window blur (user switches tabs/apps)
  window.addEventListener('blur', () => {
    dataCache.clear();
    cacheTimestamps.clear();
  });
  
  // Also clear cache periodically (every 5 minutes)
  setInterval(() => {
    dataCache.clear();
    cacheTimestamps.clear();
  }, CACHE_MAX_AGE);
}
