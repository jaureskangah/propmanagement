
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

// Composer toutes les traductions en préservant la structure documentGenerator
const baseTranslations = {
  ...enCommon,
  ...enLanding,
  ...enProperties,
  ...enDashboard,
  ...enAuth,
  ...enFinances,
  ...enMaintenance,
  ...enTenant,
  ...supportExtensions,
};

// Extraire documentGenerator de enDocuments et l'ajouter séparément
const { documentGenerator, ...otherDocuments } = enDocuments;

const translations = {
  ...baseTranslations,
  ...otherDocuments,
  documentGenerator: documentGenerator,
  // Ajouter downloadDocument à la racine pour compatibilité
  downloadDocument: documentGenerator.downloadDocument
};

// Debug: Log final des traductions composées
console.log('🔍 DEBUG: Final EN translations:', {
  hasDocumentGenerator: !!translations.documentGenerator,
  documentGeneratorType: typeof translations.documentGenerator,
  totalKeys: Object.keys(translations).length,
  documentGeneratorKeys: typeof translations.documentGenerator === 'object' ? Object.keys(translations.documentGenerator || {}) : [],
  hasDownloadDocument: !!translations.downloadDocument
});

export default translations;
