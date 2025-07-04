
// Main English translations file - now using modular approach
import { enCommon } from './features/common';
import { enLanding } from './features/landing';
import { enProperties } from './features/properties';
import { enDashboard } from './features/dashboard';
import { enDocuments } from './features/documents';
import { enAuth } from './features/auth';
import { enFinances } from './features/finances';
import { enMaintenance } from './features/maintenance';
import { enTenant } from './features/tenant';

// Support extensions
const supportExtensions = {
  getSupport: "Get Support",
};

// Compose all translations
const translations = {
  ...enCommon,
  ...enLanding,
  ...enProperties,
  ...enDashboard,
  ...enDocuments,
  ...enAuth,
  ...enFinances,
  ...enMaintenance,
  ...enTenant,
  ...supportExtensions,
};

export default translations;
