
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
import { frSettings } from './features/settings';
import { frPricing, frPlanFeatures } from './features/pricing';

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
  ...frSettings,
  ...frPricing,
  ...frPlanFeatures,
  ...supportExtensions,
};

// Extraire documentGenerator de frDocuments et l'ajouter séparément
const { documentGenerator, ...otherDocuments } = frDocuments;

const translations = {
  ...baseTranslations,
  ...otherDocuments,
  documentGenerator: documentGenerator,
  // Ajouter downloadDocument à la racine pour compatibilité
  downloadDocument: documentGenerator.downloadDocument,
  // Traductions pour les catégories de documents tenant
  otherDocuments: "Autres documents",
  importantDocuments: "Documents importants",
  leaseDocuments: "Documents de bail", 
  paymentReceipts: "Reçus de paiement",
  // Traductions pour l'upload de documents
  uploadDocument: "Téléverser un document",
  uploadNewDocument: "Ajouter un document",
  // Security disclaimer translations
  securityReminder: "Rappel de sécurité :",
  securityDisclaimerText: "Ne partagez jamais d'informations sensibles (mots de passe, numéros de carte bancaire, documents d'identité) via cette application. Utilisez des canaux sécurisés pour ce type d'informations."
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
