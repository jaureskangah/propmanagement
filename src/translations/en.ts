
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
import { enSettings } from './features/settings';
import { enPricing, enPlanFeatures } from './features/pricing';
import { enNavigation } from './features/navigation';
import { enAdmin } from './features/admin';
// Import direct des traductions communications
import { enCommunications } from './features/tenant/en/communications';

// Support extensions
const supportExtensions = {
  getSupport: "Get Support",
};

// Debug: Log pour vérifier l'import des documents
console.log('🔍 DEBUG: enDocuments import:', {
  imported: !!enDocuments,
  hasDocumentGenerator: !!(enDocuments as any)?.documentGenerator,
  documentGeneratorKeys: Object.keys((enDocuments as any)?.documentGenerator || {}),
  allTemplatesKey: (enDocuments as any)?.documentGenerator?.allTemplates
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
  // Ajouter les traductions communications directement à la racine
  ...enCommunications,
  ...enSettings,
  ...enPricing,
  ...enPlanFeatures,
  ...enNavigation,
  ...enAdmin,
  ...supportExtensions,
};

// Extraire documentGenerator de enDocuments et l'ajouter séparément
const { documentGenerator, ...otherDocuments } = enDocuments;

const translations = {
  ...baseTranslations,
  ...otherDocuments,
  documentGenerator: documentGenerator,
  // Ajouter downloadDocument à la racine pour compatibilité
  downloadDocument: documentGenerator.downloadDocument,
  // Traductions pour les catégories de documents tenant
  otherDocuments: "Other Documents",
  importantDocuments: "Important Documents", 
  leaseDocuments: "Lease Documents",
  paymentReceipts: "Payment Receipts",
  // Traductions pour l'upload de documents
  uploadDocument: "Upload Document",
  uploadNewDocument: "Add New Document",
  // Security disclaimer translations
  securityReminder: "Security Reminder:",
  securityDisclaimerText: "Never share sensitive information (passwords, credit card numbers, identity documents) through this application. Use secure channels for this type of information."
};

// Debug: Log final des traductions composées
console.log('🔍 DEBUG: Final EN translations:', {
  hasDocumentGenerator: !!translations.documentGenerator,
  documentGeneratorType: typeof translations.documentGenerator,
  totalKeys: Object.keys(translations).length,
  documentGeneratorKeys: typeof translations.documentGenerator === 'object' ? Object.keys(translations.documentGenerator || {}) : [],
  hasDownloadDocument: !!translations.downloadDocument,
  allTemplatesValue: translations.documentGenerator?.allTemplates
});

export default translations;
