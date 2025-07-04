
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
  allTemplatesKey: (frDocuments as any)?.documentGenerator?.allTemplates
});

// Composer toutes les traductions en préservant la structure documentGenerator
const baseTranslations = {
  ...frCommon,
  ...frLanding,
  ...frProperties,
  ...frDashboard,
  ...frAuth,
  ...frFinances,
  ...frMaintenance,
  ...frTenant,
  ...supportExtensions,
};

// Extraire documentGenerator de frDocuments et l'ajouter séparément
const { documentGenerator, ...otherDocuments } = frDocuments;

const translations = {
  ...baseTranslations,
  ...otherDocuments,
  documentGenerator: documentGenerator,
  // Ajouter downloadDocument à la racine pour compatibilité
  downloadDocument: documentGenerator.downloadDocument
};

// Debug: Log final des traductions composées
console.log('🔍 DEBUG: Final FR translations:', {
  hasDocumentGenerator: !!translations.documentGenerator,
  documentGeneratorType: typeof translations.documentGenerator,
  totalKeys: Object.keys(translations).length,
  documentGeneratorKeys: typeof translations.documentGenerator === 'object' ? Object.keys(translations.documentGenerator || {}) : [],
  translationsWithDocumentGenerator: translations.documentGenerator,
  hasDownloadDocument: !!translations.downloadDocument,
  allTemplatesValue: translations.documentGenerator?.allTemplates
});

// Test spécifique pour les nouvelles clés
if (typeof translations.documentGenerator === 'object' && translations.documentGenerator) {
  console.log('🔍 DEBUG: Test direct access to new keys:', {
    allTemplates: translations.documentGenerator.allTemplates,
    customTemplates: translations.documentGenerator.customTemplates,
    noTemplatesFound: translations.documentGenerator.noTemplatesFound,
    createTemplateHint: translations.documentGenerator.createTemplateHint
  });
}

export default translations;
