
/**
 * Date formatting utilities for document templates
 */

/**
 * Formats a date according to the specified format string
 * @param date The date to format
 * @param format The format string (DD/MM/YYYY)
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: string = 'DD/MM/YYYY'): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  let result = format;
  result = result.replace(/DD/g, day);
  result = result.replace(/MM/g, month);
  result = result.replace(/YYYY/g, year);
  
  return result;
};
