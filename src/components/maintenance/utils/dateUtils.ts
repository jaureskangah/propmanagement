
/**
 * Checks if a value is a valid Date or a valid date representation
 */
export const isValidDate = (value: any): boolean => {
  if (!value) return false;
  
  // If it's already a Date object
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  
  // If it's a string, try to convert it
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  return false;
};

/**
 * Converts a value to a Date object if possible
 */
export const toDate = (value: any): Date | null => {
  if (!value) return null;
  
  // If it's already a Date object
  if (value instanceof Date) {
    return !isNaN(value.getTime()) ? value : null;
  }
  
  // If it's a string, try to convert it
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date : null;
  }
  
  return null;
};
