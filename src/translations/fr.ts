
import { Translations } from './types';
import { frAdmin } from './features/admin';
import { frAuth } from './features/auth';
import { frCommon } from './features/common';
import { frContact } from './features/contact';
import { frCTA } from './features/cta';
import { frDashboard } from './features/dashboard';
import { frFAQ } from './features/faq';
import { frFeatures } from './features/features';
import { frFooter } from './features/footer';
import { frHero } from './features/hero';
import { frHowItWorks } from './features/how-it-works';
import { frMaintenance } from './features/maintenance';
import { frModal } from './features/modal';
import { frNavigation } from './features/navigation';
import { frPricing } from './features/pricing';
import { frProperty } from './features/property';
import { frSettings } from './features/settings';
import { frStatus } from './features/status';
import { frTenant } from './features/tenant';
import { frToasts } from './features/toasts';
import { frFinances } from './features/finances';
import { frVendors } from './features/maintenance/vendors';
import frDocumentGenerator from './features/documents/fr';
import { frDocuments } from './features/tenant/fr/documents';
import { frPayments } from './features/tenant/fr/payments';
import { frMaintenance as frMaintenanceTenant } from './features/tenant/fr/maintenance';

// Import tenant dashboard translations
import { frDashboard as frTenantDashboard } from './features/tenant/fr/dashboard';

// Core translations object with essential keys to prevent crashes
const translations: any = {
  // Critical landing page keys (defined first to ensure availability)
  heroTitle: "Gestion Immobilière Simplifiée",
  heroSubtitle: "La solution complète pour les propriétaires canadiens. Gérez locataires, maintenance et finances en un seul endroit.",
  heroGetStarted: "Commencer Gratuitement",
  learnMore: "En savoir plus",
  
  // Navigation essentials
  features: "Fonctionnalités",
  pricing: "Tarification",
  dashboard: "Tableau de bord",
  login: "Se connecter",
  signOut: "Se déconnecter",
  
  // Footer essentials
  companyName: "PropManagement",
  companyDescription: "Simplifier la gestion immobilière pour les propriétaires et les gestionnaires",
  product: "Produit",
  company: "Entreprise",
  legal: "Légal",
  security: "Sécurité",
  aboutUs: "À propos",
  careers: "Carrières",
  contact: "Contact",
  privacyPolicy: "Politique de confidentialité",
  termsOfService: "Conditions d'utilisation",
  cookiePolicy: "Politique des cookies",
  allRightsReserved: "Tous droits réservés",
  
  // Features section essentials
  everythingYouNeed: "Tout ce dont vous avez besoin",
  featuresSubtitle: "Des outils complets conçus pour la gestion immobilière canadienne",
  propertyManagement: "Gestion de propriétés",
  propertyManagementDesc: "Gérez toutes vos propriétés depuis un tableau de bord central",
  tenantManagement: "Gestion des locataires",
  tenantManagementDesc: "Suivez les locataires, les baux et les communications",
  maintenanceDesc: "Planifier et suivre les demandes de maintenance efficacement",
  securityDesc: "Vos données sont protégées avec une sécurité de niveau entreprise",
  
  // CTA section essentials
  readyToStart: "Prêt à simplifier votre gestion ?",
  joinOthers: "Rejoignez des milliers de propriétaires qui nous font confiance",
  ctaStartFree: "Essayer gratuitement",
  
  // Now merge with imported translations (will override duplicates)
  ...frAdmin,
  ...frAuth,
  ...frCommon,
  ...frContact,
  ...frCTA,
  ...frDashboard,
  ...frFAQ,
  ...frFeatures,
  ...frFooter,
  ...frHero,
  ...frHowItWorks,
  ...frModal,
  ...frNavigation,
  ...frPricing,
  ...frProperty,
  ...frSettings,
  ...frStatus,
  ...frTenant,
  ...frToasts,
  ...frFinances,
  ...frVendors,
  ...frMaintenance,
  
  // Tenant-specific overrides
  ...frTenantDashboard,
  documentGenerator: frDocumentGenerator,
  documents: frDocuments,
  
  // Add translations at root level for direct access
  payments: frPayments,
  maintenance: frMaintenanceTenant,
  
  // Additional common translations
  searchTenants: "Rechercher des locataires...",
  securityDeposit: "Dépôt de garantie",
  deposited: "Déposé",
  notDeposited: "Non déposé",
  emailProfileLabel: "Adresse e-mail",
  phoneProfileLabel: "Numéro de téléphone",
  rentAmountLabel: "Montant du loyer",
  leaseStartProfileLabel: "Date de début du bail",
  leaseEndProfileLabel: "Date de fin du bail",
  depositStatusUpdated: "Statut du dépôt mis à jour",
  invite: "Inviter",
  inviteTenant: "Inviter un locataire",
  perMonth: "par mois",
  error: 'Erreur',
  success: 'Succès',
  tenantAdded: 'Locataire ajouté avec succès',
  errorLoadingTenantData: 'Erreur lors du chargement des données du locataire',
  invalidEmail: 'Adresse e-mail invalide',
  invalidAmount: 'Montant invalide',
  cancel: 'Annuler',
  welcomeTenant: "Bienvenue, {name}",
  manageApartmentInfo: "Gérez les informations et communications de votre appartement",
  darkMode: "Mode Sombre",
  customizeDashboard: "Personnaliser le Tableau de Bord",
  customizeDashboardDescription: "Choisissez les widgets à afficher et leur ordre",
  maintenanceRequests: "Demandes de maintenance",
  newMaintenanceRequest: "Nouvelle demande de maintenance",
  maintenanceRequestTitlePlaceholder: "ex: Fuite d'eau dans la salle de bain",
  maintenanceDescriptionPlaceholder: "Décrivez le problème de maintenance en détail...",
  editMaintenanceRequest: "Modifier la demande de maintenance",
  searchMaintenanceRequests: "Rechercher des demandes de maintenance...",
  totalRequests: "Total des demandes",
  pendingRequests: "Demandes en attente",
  resolvedRequests: "Demandes résolues",
  noMaintenanceRequests: "Aucune demande de maintenance trouvée",
  createNewRequestToSee: "Créez une nouvelle demande de maintenance pour la voir ici.",
  deleteMaintenanceRequest: "Supprimer la demande de maintenance",
  notLinkedToTenant: "Vous n'êtes lié à aucun compte locataire",
  loading: "Chargement",
  authenticationRequired: "Authentification requise",
  pleaseSignIn: "Veuillez vous connecter pour continuer",
  accessDenied: "Accès refusé",
  tenantsOnly: "Cette section est réservée aux locataires",
  loadingMaintenanceInfo: "Chargement des informations de maintenance...",
  edit: "Modifier",
  delete: "Supprimer",
  title: "Titre",
  description: "Description",
  save: "Enregistrer",
  update: "Mettre à jour",
  create: "Créer",
  close: "Fermer",
  confirm: "Confirmer",
  pleaseSelectPriority: "Veuillez sélectionner une priorité",
  pleaseSelectStatus: "Veuillez sélectionner un statut",
  pleaseProvideDescription: "Veuillez fournir une description",
  pleaseFillAllFields: "Veuillez remplir tous les champs obligatoires",
  tenantIdMissing: "ID du locataire manquant",
  notAuthenticated: "Non authentifié",
  tenantNotFound: "Locataire introuvable",
  errorCreatingRequest: "Erreur lors de la création de la demande de maintenance",
  maintenanceRequestSubmitted: "Demande de maintenance soumise avec succès",
  errorSubmittingRequest: "Erreur lors de la soumission de la demande",
  maintenanceRequestUpdated: "Demande de maintenance mise à jour avec succès",
  errorUpdatingRequest: "Erreur lors de la mise à jour de la demande",
  required: "Obligatoire",
  optional: "Optionnel",
  selectOption: "Sélectionner une option",
  noOptionsAvailable: "Aucune option disponible",
  selectPriority: "Sélectionner la priorité",
  status: "Statut",
  priority: "Priorité",
  pending: "En attente",
  inProgress: "En cours",
  resolved: "Résolu",
  completed: "Terminé",
  cancelled: "Annulé",
  low: "Faible",
  medium: "Moyen",
  high: "Élevé",
  urgent: "Urgent",
  created: "Créé",
  updated: "Mis à jour",
  createdAt: "Créé le",
  updatedAt: "Mis à jour le",
  createdOn: "Créé le",
  viewDetails: "Voir les détails",
  viewAll: "Voir tout",
  showMore: "Voir plus",
  showLess: "Voir moins",
  refresh: "Actualiser",
  reload: "Recharger",
  retry: "Réessayer",
  newRequest: "Nouvelle demande",
  andMoreRequests: "et {count} de plus",
  manageMaintenanceRequests: "Gérez et suivez vos demandes de maintenance",
  photos: "Photos",
  photosSelected: "photo(s) sélectionnée(s)",
  submitRequest: "Soumettre la demande",
  submitting: "Soumission...",
  updateRequest: "Mettre à jour la demande",
  updating: "Mise à jour...",
  newUpdate: "nouvelle mise à jour",
  newUpdates: "nouvelles mises à jour",
  leaseStatusExpiringDays: "Expire dans {days} jours",
  leaseStatusExpired: "Expiré il y a {days} jours",
  daysLeft: "{days} jours restants",
  daysAgo: "il y a {days} jours",
  andMoreMessages: "et {count} messages de plus",
  andMoreDocuments: "et {count} documents de plus",
  welcomeGeneric: "Bienvenue sur votre tableau de bord",
  lightMode: "Mode Clair",
  viewAllDocuments: "Voir tous les documents",
  noDocuments: "Aucun document disponible",
  noCommunications: "Aucune communication",
  allMessages: "Tous les messages",
  newMessage: "Nouveau message",
  sentByYou: "Envoyé par vous",
  noPaymentHistory: "Aucun historique de paiement disponible",
  amount: "Montant",
  paymentHistory: "Historique des paiements",
  paid: "Payé",
  overdue: "En retard",
  unitLabel: "Unité",
  lease: {
    start: "Début du bail",
    end: "Fin du bail"
  },
  leaseStatusActive: "Bail actif",
  overview: "Aperçu"
};

export default translations;
