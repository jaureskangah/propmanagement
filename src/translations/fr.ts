
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
import { frComingSoon } from './features/comingSoon';
import { frAI } from './features/ai';
import { frSecurity } from './features/security';
import { frList } from './features/tenant/fr/list';
import { frPayments } from './features/tenant/fr/payments';

// Extensions de support
const supportExtensions = {
  getSupport: "Obtenir du Support",
};

// Utility function to flatten nested objects with prefix
function flattenObject(obj: any, prefix = '', result: any = {}): any {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

// Flatten security translations
const flattenedSecurity = flattenObject(frSecurity, 'security');


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
  ...frComingSoon,
  ...frAI,
  ...frList,
  ...frPayments,
  ...supportExtensions,
};

// Extraire documentGenerator de frDocuments et l'ajouter séparément
const { documentGenerator, ...otherDocuments } = frDocuments;

const translations = {
  ...baseTranslations,
  ...otherDocuments,
  ...flattenedSecurity,
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
  securityDisclaimerText: "Ne partagez jamais d'informations sensibles (mots de passe, numéros de carte bancaire, documents d'identité) via cette application. Utilisez des canaux sécurisés pour ce type d'informations.",
  
  // Additional tenant list translations
  listBack: "Retour",
  listSelectTenant: "Sélectionnez un locataire pour voir les détails",
  unitLabel: "Unité",
  propertyNotFound: "Propriété non trouvée",
  propertyError: "Erreur lors du chargement de la propriété",
  filters: "Filtres",
  filterByProperty: "Filtrer par propriété",
  allProperties: "Toutes les propriétés",
  clearFilters: "Effacer",
  saving: "Enregistrement...",
  
  // Additional maintenance translations
  loadingProperties: "Chargement des propriétés...",
  
  // Tenant actions
  modify: "Modifier",
  delete: "Supprimer", 
  invite: "Inviter",
  noPropertyAssigned: "Aucune propriété assignée",
  
  // Additional tenant list translations
  tenantsList: "Locataires",
  tenantsSubtitle: "Gérez vos locataires", 
  addTenant: "Ajouter un Locataire",
  noTenants: "Aucun locataire trouvé",
  noTenantsFiltered: "Aucun locataire ne correspond aux filtres actuels",
  tenantCount: "{count} locataires",
  tenantCountSingular: "1 locataire",
  
  // Property form translations
  monthlyRent: "Loyer Mensuel ($)",
  dragImageHere: "Glissez une image ici ou cliquez pour sélectionner",
  imageFormats: "PNG, JPG, GIF jusqu'à 10Mo",
  createProperty: "Créer une Propriété",
  updateProperty: "Mettre à jour la Propriété",
  
  // Property table headers
  propertyName: "Nom de la Propriété",
  address: "Adresse",
  type: "Type",
  units: "Unités",
  occupation: "Occupation",
  createdAt: "Créé le",
  actions: "Actions",
  selectAll: "Tout sélectionner",
  
  // Property actions bar
  propertySelected: "propriété sélectionnée",
  propertiesSelected: "propriétés sélectionnées",
  deleteSelected: "Supprimer",
  unselectAll: "Désélectionner",
  
  // Additional pricing plan features
  upTo1Property: "1 propriété",
  upTo1Tenant: "1 locataire",
  allStandardFeatures: "Tous les avantages du Plan Standard",
  
  // Common translations
  "common.backToHome": "Retour à l'accueil",
  
  // Generic security translations
  security: "Sécurité",
  securityDesc: "Protection complète de vos données avec chiffrement de niveau entreprise et contrôles d'accès"
};


export default translations;
