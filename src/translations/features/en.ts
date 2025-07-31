
import { enCommon } from './common';
import { enDashboard } from './dashboard';
import { enFinances } from './finances';
import { enMaintenance } from './maintenance';
import { enAuth } from './auth';
import { enLease } from './tenant/en/lease';
import { enDashboard as enTenantDashboard } from './tenant/en/dashboard';
import { enToasts } from './toasts';
import { enAdmin } from './admin';

export const en = {
  ...enCommon,
  ...enDashboard,
  ...enFinances,
  ...enMaintenance,
  ...enAuth,
  ...enToasts,
  ...enAdmin,
  
  // Lease translations
  ...enLease,
  
  // Tenant dashboard translations
  ...enTenantDashboard,
  
  // Additional lease management translations
  leaseExpiry: "Lease Expiry",
  leaseExpiryManagement: "Lease Expiry Management",
  leaseExpiryNotifications: "Lease Expiry Notifications",
  enableLeaseReminders: "Enable lease reminders",
  reminderSettings: "Reminder Settings",
  daysBeforeExpiry: "Days before expiry",
  notificationMethod: "Notification method",
  emailAndApp: "Email and App",
  emailOnly: "Email only",
  appOnly: "App only",
  leaseStatus: "Lease Status",
  
  // Reports translations
  revenueEvolution: "Revenue Evolution",
  maintenanceByPriority: "Maintenance by Priority",
  maintenanceByStatus: "Maintenance by Status",
  occupancyTrends: "Occupancy Trends",
  currentOccupancy: "Current Occupancy",
  activeTenants: "Active Tenants",
  totalUnits: "Total Units",
  
  // Analytics translations
  analyticsOverview: "Analytics Overview",
  comprehensiveAnalytics: "Comprehensive analysis of your real estate data",
  
  // Supabase Logs translations
  supabaseLogs: "Supabase Logs",
  edgeFunctionsLogs: "Edge Functions Logs",
  authLogs: "Authentication Logs",
  databaseLogs: "Database Logs",
  noLogsAvailable: "No logs available",
  metadata: "Metadata",
  
  // Priority translations
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  
  // Status translations
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};
