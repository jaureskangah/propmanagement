
/**
 * Date utility functions for maintenance components
 */

/**
 * Checks if a value is a valid date
 * @param dateValue The value to check (string or Date)
 * @returns boolean indicating if the value is a valid date
 */
export const isValidDate = (dateValue: string | Date | undefined): boolean => {
  if (!dateValue) return false;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return !isNaN(dateValue.getTime());
  }
  
  // If it's a string, try to convert it
  try {
    const date = new Date(dateValue);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
};

/**
 * Converts a value to a Date object
 * @param dateValue The value to convert (string or Date)
 * @returns Date object or null if invalid
 */
export const toDate = (dateValue: string | Date | undefined): Date | null => {
  if (!dateValue) return null;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return !isNaN(dateValue.getTime()) ? dateValue : null;
  }
  
  // If it's a string, try to convert it
  try {
    // Check if the string is in YYYY-MM-DD format
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [year, month, day] = dateValue.split('-').map(Number);
      // Note: month is 0-indexed in Date constructor
      return new Date(year, month - 1, day);
    }
    
    // Try regular parsing
    const date = new Date(dateValue);
    return !isNaN(date.getTime()) ? date : null;
  } catch (e) {
    console.error("Error converting to date:", e);
    return null;
  }
};

/**
 * Formats a date as YYYY-MM-DD to prevent timezone issues
 * @param dateValue The date value to format (string or Date)
 * @returns Formatted date string
 */
export const formatSafeDate = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return '';
  
  let date: Date | null = null;
  
  if (dateValue instanceof Date) {
    date = isNaN(dateValue.getTime()) ? null : dateValue;
  } else if (typeof dateValue === 'string') {
    // Try to parse the date
    try {
      date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return dateValue; // Return the original string if parsing fails
      }
    } catch (e) {
      return dateValue;
    }
  }
  
  if (!date) return '';
  
  // Create a date string in YYYY-MM-DD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Parses a date string in YYYY-MM-DD format and returns a Date object
 * @param dateString The date string to parse
 * @returns Date object or null if invalid
 */
export const parseYYYYMMDD = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') return null;
  
  // Check if the string matches the YYYY-MM-DD format
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
  const day = parseInt(match[3], 10);
  
  // Create a date object directly specifying the components
  const date = new Date(year, month, day);
  
  // Verify the date is valid
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return date;
  }
  
  return null;
};

/**
 * Display date in the user's preferred format
 */
export const formatDisplayDate = (dateValue: string | Date | undefined, language: string = 'en'): string => {
  if (!dateValue) return '';
  
  const date = toDate(dateValue);
  if (!date) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return language === 'fr' ? 
    `${day}/${month}/${year}` : 
    `${month}/${day}/${year}`;
};
