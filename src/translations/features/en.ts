
import { enCommon } from './common';
import { enDashboard } from './dashboard';
import { enFinances } from './finances';
import { enMaintenance } from './maintenance';
import { enAuth } from './auth';
import { enLease } from './tenant/en/lease';
import { enDashboard as enTenantDashboard } from './tenant/en/dashboard';

export const en = {
  ...enCommon,
  ...enDashboard,
  ...enFinances,
  ...enMaintenance,
  ...enAuth,
  
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
};
