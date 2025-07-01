import { enCommon } from './common';
import { enDashboardActivity, enDashboardCore, enDashboardDates, enDashboardStatus, enDashboardNotifications } from './dashboard';
import { enFinances } from './finances';
import { enInvitations } from './invitations';
import { enMaintenance } from './maintenance';
import { enOnboarding } from './onboarding';
import { enProperties } from './properties';
import { enPropertySettings } from './property-settings';
import { enShared } from './shared';
import { enTasks } from './tasks';
import { enTenants } from './tenants';
import { enUserManagement } from './user-management';
import { enAuth } from './auth';
import { enLease } from './tenant/en/lease';
import { enDashboard as enTenantDashboard } from './tenant/en/dashboard';

export const en = {
  ...enCommon,
  ...enDashboardActivity,
  ...enDashboardCore,
  ...enDashboardDates,
  ...enDashboardStatus,
  ...enDashboardNotifications,
  ...enFinances,
  ...enInvitations,
  ...enMaintenance,
  ...enOnboarding,
  ...enProperties,
  ...enPropertySettings,
  ...enShared,
  ...enTasks,
  ...enTenants,
  ...enUserManagement,
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
};
