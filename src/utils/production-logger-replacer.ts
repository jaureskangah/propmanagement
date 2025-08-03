/**
 * Production logging cleanup utility
 * Automatically disables console logs in production
 */

// Save original console methods before any modifications
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
};

// Production cleanup utility
export const cleanupProductionLogging = () => {
  if (import.meta.env.PROD) {
    // In production, disable console logs except errors
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.debug = () => {};
    // Keep console.error for critical issues
  }
};

// Simple utility to check if we should log
export const shouldLog = () => {
  return import.meta.env.DEV;
};

// Export original console for logger to use
export { originalConsole };

// Auto-cleanup in production
cleanupProductionLogging();
