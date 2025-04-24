
/**
 * Date utility functions for maintenance components
 */

/**
 * Checks if a value is a valid date
 * @param dateValue The value to check (string or Date)
 * @returns boolean indicating if the value is a valid date
 */
export const isValidDate = (dateValue: string | Date): boolean => {
  if (!dateValue) return false;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return !isNaN(dateValue.getTime());
  }
  
  // If it's a string, try to convert it
  const date = new Date(dateValue);
  return !isNaN(date.getTime());
};

/**
 * Converts a value to a Date object
 * @param dateValue The value to convert (string or Date)
 * @returns Date object or null if invalid
 */
export const toDate = (dateValue: string | Date): Date | null => {
  if (!dateValue) return null;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return !isNaN(dateValue.getTime()) ? dateValue : null;
  }
  
  // If it's a string, try to convert it
  const date = new Date(dateValue);
  return !isNaN(date.getTime()) ? date : null;
};

/**
 * Formats a date as YYYY-MM-DD to prevent timezone issues
 * @param dateValue The date value to format (string or Date)
 * @returns Formatted date string
 */
export const formatSafeDate = (dateValue: string | Date): string => {
  if (!isValidDate(dateValue)) return typeof dateValue === 'string' ? dateValue : '';
  
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date.toISOString().split('T')[0];
};
