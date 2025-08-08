
/**
 * Date formatting utilities for document templates
 */

import { parseDateSafe } from "@/lib/date";

/**
 * Formats a date according to the specified format string
 * @param date The date to format (Date or YYYY-MM-DD string)
 * @param format The format string (DD/MM/YYYY)
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY'): string => {
  const d = parseDateSafe(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString();
  
  let result = format;
  result = result.replace(/DD/g, day);
  result = result.replace(/MM/g, month);
  result = result.replace(/YYYY/g, year);
  
  return result;
};
