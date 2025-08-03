/**
 * Utility script to replace all console.log with production-safe logger
 * Run this script to clean up console.log statements for production
 */

import { logger } from './logger';

// This utility helps replace console.log with appropriate logger calls
export const replaceConsoleLog = (message: string, ...args: any[]) => {
  // In production, this should be handled by build-time replacements
  // For now, we use the logger utility
  if (message.includes('[AUTH]') || message.includes('auth') || message.includes('Auth')) {
    return logger.auth(message, ...args);
  }
  
  if (message.includes('[TENANT]') || message.includes('tenant') || message.includes('Tenant')) {
    return logger.tenant(message, ...args);
  }
  
  if (message.includes('[ADMIN]') || message.includes('admin') || message.includes('Admin')) {
    return logger.admin(message, ...args);
  }
  
  if (message.includes('error') || message.includes('Error') || message.includes('ERROR')) {
    return logger.error(message, ...args);
  }
  
  // Default to debug for development
  return logger.debug(message, ...args);
};

// Replace console.log globally in development
if (import.meta.env.DEV) {
  // Override console.log to use our logger in development
  const originalConsoleLog = console.log;
  console.log = (...args: any[]) => {
    if (args.length > 0 && typeof args[0] === 'string') {
      return replaceConsoleLog(args[0], ...args.slice(1));
    }
    return originalConsoleLog(...args);
  };
}

// Production cleanup utility
export const cleanupProductionLogging = () => {
  if (import.meta.env.PROD) {
    // In production, disable console logs except errors
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    // Keep console.error for critical issues
  }
};

// Auto-cleanup in production
cleanupProductionLogging();
