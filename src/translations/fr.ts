
// Main French translations file - now using modular approach
import { frCommon } from './features/common';
import { frLanding } from './features/landing';
import { frProperties } from './features/properties';
import { frDashboard } from './features/dashboard';
import { frDocuments } from './features/documents';
import { frAuth } from './features/auth';
import { frFinances } from './features/finances';
import { frMaintenance } from './features/maintenance';
import { frTenant } from './features/tenant';

// Extensions de support
const supportExtensions = {
  getSupport: "Obtenir du Support",
};

// Composer toutes les traductions
const translations = {
  ...frCommon,
  ...frLanding,
  ...frProperties,
  ...frDashboard,
  ...frDocuments,
  ...frAuth,
  ...frFinances,
  ...frMaintenance,
  ...frTenant,
  ...supportExtensions,
};

export default translations;
