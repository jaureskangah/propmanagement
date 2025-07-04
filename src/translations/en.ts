
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

// Debug: Log pour vérifier l'import des documents
console.log('🔍 DEBUG: enDocuments import:', {
  imported: !!enDocuments,
  hasDocumentGenerator: !!(enDocuments as any)?.documentGenerator,
  documentGeneratorKeys: Object.keys((enDocuments as any)?.documentGenerator || {})
});

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

// Debug: Log final des traductions composées
console.log('🔍 DEBUG: Final EN translations:', {
  hasDocumentGenerator: !!(translations as any)?.documentGenerator,
  totalKeys: Object.keys(translations).length,
  documentGeneratorKeys: Object.keys((translations as any)?.documentGenerator || {})
});

export default translations;
