
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

// Debug: Log pour vérifier l'import des documents
console.log('🔍 DEBUG: frDocuments import:', {
  imported: !!frDocuments,
  hasDocumentGenerator: !!(frDocuments as any)?.documentGenerator,
  documentGeneratorKeys: Object.keys((frDocuments as any)?.documentGenerator || {}),
  fullfrDocuments: frDocuments
});

// Debug spécifique pour documentGenerator
console.log('🔍 DEBUG: frDocuments.documentGenerator:', (frDocuments as any)?.documentGenerator);

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

// Debug: Log final des traductions composées
console.log('🔍 DEBUG: Final FR translations:', {
  hasDocumentGenerator: !!(translations as any)?.documentGenerator,
  totalKeys: Object.keys(translations).length,
  documentGeneratorKeys: Object.keys((translations as any)?.documentGenerator || {}),
  translationsWithDocumentGenerator: translations.documentGenerator
});

// Test spécifique pour une clé documentGenerator
console.log('🔍 DEBUG: Test direct access to documentGenerator.saveTemplate:', translations.documentGenerator?.saveTemplate);

export default translations;
