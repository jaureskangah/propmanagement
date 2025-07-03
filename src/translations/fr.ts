import { frCommon } from './common';
import { frDashboard } from './dashboard';
import { frAuth } from './auth';
import { frFinances } from './finances';
import { frMaintenance } from './maintenance';
import { frSettings } from './settings';
import { frLease } from './tenant/fr/lease';
import { frDashboard as frTenantDashboard } from './tenant/fr/dashboard';

const fr = {
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

  // Root level form translations (moved from nested form object)
  formNameLabel: "Nom complet",
  formNamePlaceholder: "Entrez le nom complet du locataire",
  formEmailFormLabel: "Adresse e-mail",
  formEmailPlaceholder: "Entrez l'adresse e-mail du locataire",
  formPhoneFormLabel: "Numéro de téléphone",
  formPhonePlaceholder: "Entrez le numéro de téléphone du locataire",
  formPropertyLabel: "Propriété",
  formPropertyPlaceholder: "Sélectionnez la propriété",
  formUnitFormLabel: "Numéro d'unité",
  formUnitPlaceholder: "Entrez le numéro d'unité",
  formLeaseStartFormLabel: "Date de début",
  formLeaseEndFormLabel: "Date de fin",
  formRentLabel: "Loyer mensuel",
  formRentPlaceholder: "Entrez le montant du loyer mensuel",
  
  // Additional translations for loading states
  noProperties: "Aucune propriété disponible",
};

export default fr;
