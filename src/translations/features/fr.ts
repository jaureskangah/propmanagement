
import { frCommon } from './common';
import { frDashboard } from './dashboard';
import { frAuth } from './auth';
import { frFinances } from './finances';
import { frMaintenance } from './maintenance';
import { frSettings } from './settings';
import { frLease } from './tenant/fr/lease';
import { frDashboard as frTenantDashboard } from './tenant/fr/dashboard';

export const fr = {
  ...frCommon,
  ...frDashboard,
  ...frAuth,
  ...frFinances,
  ...frMaintenance,
  ...frSettings,
  
  // Lease translations
  ...frLease,
  
  // Tenant dashboard translations
  ...frTenantDashboard,
  
  // Additional lease management translations
  leaseExpiry: "Expiration du bail",
  leaseExpiryManagement: "Gestion de l'expiration des baux",
  leaseExpiryNotifications: "Notifications d'expiration de bail",
  enableLeaseReminders: "Activer les rappels de bail",
  reminderSettings: "Paramètres de rappel",
  daysBeforeExpiry: "Jours avant expiration",
  notificationMethod: "Méthode de notification",
  emailAndApp: "Email et App",
  emailOnly: "Email uniquement",
  appOnly: "App uniquement",
  leaseStatus: "Statut du bail",
};
