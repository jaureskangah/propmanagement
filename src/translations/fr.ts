
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
  securityDesc: "Protection complète de vos données avec chiffrement de niveau entreprise et contrôles d'accès",
  
  // About page translations
  "about.title": "À propos de PropManagement",
  "about.description": "PropManagement se consacre à simplifier la gestion immobilière pour les propriétaires et les gestionnaires immobiliers. Notre plateforme simplifie l'ensemble du processus de gestion immobilière, du tri des locataires aux demandes de maintenance.",
  "about.mission.title": "Notre Mission",
  "about.mission.description": "Fournir des solutions innovantes qui rendent la gestion immobilière plus efficace, transparente et rentable pour les propriétaires tout en assurant une meilleure expérience aux locataires.",
  "about.values.title": "Nos Valeurs",
  "about.values.innovation.title": "Innovation :",
  "about.values.innovation.description": "Améliorer continuellement notre plateforme avec une technologie de pointe.",
  "about.values.integrity.title": "Intégrité :",
  "about.values.integrity.description": "Opérer avec transparence et honnêteté dans toutes nos relations.",
  "about.values.customerFocus.title": "Orientation Client :",
  "about.values.customerFocus.description": "Placer les besoins de nos utilisateurs au premier plan dans tout ce que nous faisons.",
  
  // Careers page translations
  "careers.title": "Rejoignez notre équipe",
  "careers.subtitle": "Aidez-nous à révolutionner la gestion immobilière tout en développant votre carrière avec une équipe qui valorise l'innovation, la collaboration et la croissance.",
  "careers.viewPositions": "Voir notre opportunité",
  "careers.whyJoinUs": "Pourquoi rejoindre PropManagement?",
  "careers.opportunityTitle": "Opportunité de Cofondateur",
  
  // Job offer
  "job.title": "Bras Droit / Cofondateur – PropManagement",
  "job.location": "Moncton (NB) – possibilité hybride/remote",
  "job.type": "Cofondateur / Equity Partner",
  "job.availability": "Dès maintenant",
  
  // About PropManagement section
  "job.aboutPropManagement": "À propos de PropManagement",
  "job.aboutPropManagementDesc": "PropManagement est une plateforme SaaS conçue pour aider les petits propriétaires à gérer leurs biens locatifs de manière simple, rapide et efficace. Notre mission est claire : « Gérez plus, stressez moins ».",
  
  "job.propManagementFeatures": "Avec PropManagement, les propriétaires peuvent :",
  "job.collectRent": "Collecter les loyers en ligne 💰",
  "job.trackMaintenance": "Suivre les demandes de maintenance 🔧",
  "job.communicateWithTenants": "Communiquer facilement avec leurs locataires 📩", 
  "job.centralizeDocuments": "Centraliser leurs documents 📂",
  
  "job.accelerateProgram": "Nous avons récemment intégré le programme Accelerate Tech 2025/26 de Tribe Network, ce qui marque une étape clé dans notre développement.",
  
  // The role section
  "job.theRole": "Le rôle",
  "job.roleDescription": "Nous recherchons un bras droit / cofondateur pour rejoindre l'aventure et accélérer la croissance de PropManagement. Ton rôle sera de m'épauler sur :",
  
  "job.operationsOrg": "Opérations & organisation : structurer les process internes et assurer le suivi des objectifs.",
  "job.growthAcquisition": "Croissance & acquisition : élaborer et exécuter la stratégie marketing, partenariats et ventes.",
  "job.userRelations": "Relations utilisateurs : accompagner nos premiers propriétaires, gérer leurs retours et améliorer l'expérience client.",
  "job.fundraisingPartnerships": "Levée de fonds & partenariats : participer à la préparation des pitchs, rencontrer investisseurs et partenaires stratégiques.",
  
  // Who you are section
  "job.whoYouAre": "Profil recherché",
  "job.entrepreneurHeart": "Tu es entrepreneur dans l'âme, attiré(e) par les startups early-stage.",
  "job.experiencedInterested": "Tu as une expérience ou un fort intérêt en marketing digital, business development ou gestion de projet.",
  "job.practicalOriented": "Tu es pragmatique et orienté solutions, capable de gérer plusieurs missions avec autonomie.",
  "job.motivatedImpact": "Tu veux avoir un impact direct sur la réussite d'un projet et bâtir quelque chose de grand dès le départ.",
  "job.comfortableLean": "Tu es à l'aise dans un environnement lean (peu de moyens mais beaucoup d'ambition 💡).",
  
  // What we offer section
  "job.whatWeOffer": "Ce que nous offrons",
  "job.coFounderOpportunity": "L'opportunité de devenir cofondateur d'une startup PropTech à fort potentiel.",
  "job.equityOwnership": "Une participation au capital (equity), négociable selon l'engagement.",
  "job.centralRole": "Une place centrale dans un projet qui vise à transformer la gestion locative au Canada.",
  "job.networkAccess": "L'accès à un réseau d'experts, de mentors et d'investisseurs via le programme Accelerate Tech.",
  
  // How to apply section
  "job.howToApply": "Comment postuler",
  "job.applyDescription": "Si tu veux rejoindre cette aventure et devenir le partenaire clé de PropManagement, contacte-moi :",
  "job.applyEmail": "contact@propmanagement.app", 
  "job.applyLinkedIn": "https://www.linkedin.com/in/jaureskangah/",
  "job.applyInstructions": "Parle-moi de ton parcours, de tes motivations et de ce que tu pourrais apporter au projet.",
  "job.buildTogether": "Construisons ensemble la solution que les petits propriétaires attendaient !",
  
  "job.applyNow": "Postuler maintenant"
};


export default translations;
