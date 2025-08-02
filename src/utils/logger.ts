/**
 * Production-ready logging utility
 * Only logs in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error('[ERROR]', ...args);
  },
  
  auth: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[AUTH]', ...args);
    }
  },
  
  tenant: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[TENANT]', ...args);
    }
  },
  
  admin: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[ADMIN]', ...args);
    }
  }
};