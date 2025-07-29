
import { enCommon } from './common';
import { enDashboard } from './dashboard';
import { enFinances } from './finances';
import { enMaintenance } from './maintenance';
import { enAuth } from './auth';
import { enLease } from './tenant/en/lease';
import { enDashboard as enTenantDashboard } from './tenant/en/dashboard';
import { enToasts } from './toasts';

export const en = {
  ...enCommon,
  ...enDashboard,
  ...enFinances,
  ...enMaintenance,
  ...enAuth,
  ...enToasts,
  
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
};
