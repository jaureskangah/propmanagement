
// Main French translations file - now using modular approach
import { frCommon } from './features/common';
import { frLanding } from './features/landing';
import { frProperties } from './features/properties';
import { frProperty } from './features/property';
import { frDashboard } from './features/dashboard';
import { frDocuments } from './features/documents';
import { frAuth } from './features/auth';
import { frFinances } from './features/finances';
import { frMaintenance } from './features/maintenance';
import { frTenant } from './features/tenant';
import { frSettings } from './features/settings';
import { frPricing, frPlanFeatures } from './features/pricing';
import { frNavigation } from './features/navigation';
import { frAdmin } from './features/admin';
import { fr as frFeatures } from './features/fr';

// Extensions de support
const supportExtensions = {
  getSupport: "Obtenir du Support",
};


// Composer toutes les traductions en préservant la structure documentGenerator
const baseTranslations = {
  ...frCommon,
  ...frLanding,
  ...frProperties,
  ...frProperty,
  ...frDashboard,
  ...frAuth,
  ...frFinances,
  ...frMaintenance,
  ...frTenant,
  ...frSettings,
  ...frPricing,
  ...frPlanFeatures,
  ...frNavigation,
  ...frAdmin,
  ...frFeatures,
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


export default translations;
