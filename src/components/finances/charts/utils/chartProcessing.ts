
// This file contains utility functions to process financial data for charts
import { format, parseISO } from 'date-fns';
import { formatSafeDate, isValidDate } from '@/components/maintenance/utils/dateUtils';

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
 * Normalise les données de dépenses, en gérant les structures variées
 */
const normalizeExpenseData = (expenses: any[] = []) => {
  return expenses.map(expense => {
    // Si c'est une intervention vendor, souvent elle utilise 'cost' au lieu de 'amount'
    const amount = expense.amount !== undefined ? expense.amount : expense.cost || 0;
    
    return {
      ...expense,
      amount
    };
  });
};

/**
 * Process payment and expense data into monthly format for charts
 * With memoization to improve performance
 */
export const processMonthlyData = (payments: any[] = [], expenses: any[] = [], year = new Date().getFullYear()) => {
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
  
  console.log(`Processing chart data for year ${year}:`, {
    paymentItems: payments.length,
    expenseItems: expenses.length,
    firstPayment: payments[0],
    firstExpense: expenses[0],
  });
  
  // Initialize month data structure
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: getMonthName(i),
    month: i + 1,
    income: 0,
    expense: 0,
    profit: 0,
  }));

  // Normalize expenses data to ensure consistency
  const normalizedExpenses = normalizeExpenseData(expenses);

  // Process payments with validation
  payments.forEach((payment) => {
    try {
      if (!payment.payment_date) {
        console.warn("Payment missing date:", payment);
        return;
      }
      
      const date = safeParseDate(payment.payment_date);
      if (date && date.getFullYear() === year) {
        const month = date.getMonth();
        // Only count paid payments as income
        if (payment.status === 'paid' || payment.status === 'completed') {
          const amount = safeNumber(payment.amount);
          if (month >= 0 && month < 12) {
            monthlyData[month].income += amount;
            console.log(`Added payment for ${getMonthName(month)}: ${amount}`);
          }
        }
      }
    } catch (error) {
      console.error("Error processing payment:", payment, error);
    }
  });

  // Process expenses with validation
  normalizedExpenses.forEach((expense) => {
    try {
      if (!expense.date) {
        console.warn("Expense missing date:", expense);
        return;
      }
      
      const date = safeParseDate(expense.date);
      if (date && date.getFullYear() === year) {
        const month = date.getMonth();
        const expenseAmount = safeNumber(expense.amount);
        if (month >= 0 && month < 12) {
          monthlyData[month].expense += expenseAmount;
          console.log(`Added expense for ${getMonthName(month)}: ${expenseAmount}`);
        }
      }
    } catch (error) {
      console.error("Error processing expense:", expense, error);
    }
  });

  // Calculate profit for each month
  monthlyData.forEach((month) => {
    month.profit = month.income - month.expense;
  });

  console.log(`Chart data processed for ${year}:`, monthlyData);

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
  
  console.log("Processing yearly data:", {
    paymentItems: payments.length,
    expenseItems: expenses.length,
    year: currentYear
  });
  
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

  // Normalize expenses first
  const normalizedExpenses = normalizeExpenseData(expenses);

  // Process payments with validation
  payments.forEach((payment) => {
    try {
      if (!payment.payment_date) return;
      
      const date = safeParseDate(payment.payment_date);
      if (date) {
        const year = date.getFullYear().toString();
        // Only count paid payments as income
        if (payment.status === 'paid' || payment.status === 'completed') {
          const amount = safeNumber(payment.amount);
          
          if (yearDataMap.has(year)) {
            const yearData = yearDataMap.get(year);
            yearData.income += amount;
            console.log(`Added yearly payment for ${year}: ${amount}`);
          }
        }
      }
    } catch (error) {
      console.error("Error processing yearly payment:", payment, error);
    }
  });

  // Process expenses with validation
  normalizedExpenses.forEach((expense) => {
    try {
      if (!expense.date) return;
      
      const date = safeParseDate(expense.date);
      if (date) {
        const year = date.getFullYear().toString();
        
        if (yearDataMap.has(year)) {
          const yearData = yearDataMap.get(year);
          const expenseAmount = safeNumber(expense.amount);
          yearData.expense += expenseAmount;
          console.log(`Added yearly expense for ${year}: ${expenseAmount}`);
        }
      }
    } catch (error) {
      console.error("Error processing yearly expense:", expense, error);
    }
  });

  // Calculate profit and finalize data
  const result = years.map(year => {
    const yearStr = year.toString();
    const data = yearDataMap.get(yearStr);
    data.profit = data.income - data.expense;
    return data;
  });

  console.log("Yearly data processed:", result);

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
