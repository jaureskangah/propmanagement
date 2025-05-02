
import { addDays } from "date-fns";

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function format(date: Date, formatStr: string, options: { locale?: Locale }): string {
  try {
    // Re-export the format function from date-fns to ensure proper typing
    const { format: dateFormat } = require("date-fns");
    return dateFormat(date, formatStr, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(date);
  }
}
