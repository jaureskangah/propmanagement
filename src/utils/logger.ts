/**
 * Production-ready logging utility
 * Only logs in development mode
 */

import { originalConsole } from './production-logger-replacer';

const isDevelopment = import.meta.env.DEV;

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      originalConsole.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      originalConsole.info('[INFO]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      originalConsole.warn('[WARN]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    originalConsole.error('[ERROR]', ...args);
  },
  
  auth: (...args: any[]) => {
    if (isDevelopment) {
      originalConsole.log('[AUTH]', ...args);
    }
  },
  
  tenant: (...args: any[]) => {
    if (isDevelopment) {
      originalConsole.log('[TENANT]', ...args);
    }
  },
  
  admin: (...args: any[]) => {
    if (isDevelopment) {
      originalConsole.log('[ADMIN]', ...args);
    }
  }
};