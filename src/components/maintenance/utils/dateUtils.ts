
/**
 * Date utility functions for maintenance components
 */

/**
 * Checks if a string is a valid date
 * @param dateString The string to check
 * @returns boolean indicating if the string is a valid date
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Converts a string to a Date object
 * @param dateString The string to convert
 * @returns Date object or null if invalid
 */
export const toDate = (dateString: string): Date | null => {
  if (!isValidDate(dateString)) return null;
  
  return new Date(dateString);
};

/**
 * Formats a date as YYYY-MM-DD to prevent timezone issues
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export const formatSafeDate = (dateString: string): string => {
  if (!isValidDate(dateString)) return dateString;
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};
