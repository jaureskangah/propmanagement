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

// Créer un objet de traduction unique qui résout les conflits
const translations: any = {
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
  ...frMaintenance,
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
  // Tenant dashboard translations (override with tenant-specific ones)
  ...frTenantDashboard,
  documentGenerator: frDocumentGenerator,
  documents: frDocuments,
  // Add translations at root level for direct access
  payments: frPayments,
  maintenance: frMaintenanceTenant,
  // Traductions pour la page des locataires
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
  // Messages génériques
  error: 'Erreur',
  success: 'Succès',
  tenantAdded: 'Locataire ajouté avec succès',
  errorLoadingTenantData: 'Erreur lors du chargement des données du locataire',
  invalidEmail: 'Adresse e-mail invalide',
  invalidAmount: 'Montant invalide',
  cancel: 'Annuler',
  // Missing tenant dashboard keys
  welcomeTenant: "Bienvenue, {name}",
  manageApartmentInfo: "Gérez les informations et communications de votre appartement",
  darkMode: "Mode Sombre",
  customizeDashboard: "Personnaliser le Tableau de Bord",
  customizeDashboardDescription: "Choisissez les widgets à afficher et leur ordre",
  // Maintenance-specific keys from tenant maintenance - expose at root level
  maintenanceRequests: "Demandes de maintenance",
  newMaintenanceRequest: "Nouvelle demande de maintenance",
  maintenanceRequestTitlePlaceholder: "ex: Fuite d'eau dans la salle de bain",
  maintenanceDescriptionPlaceholder: "Décrivez le problème de maintenance en détail...",
  searchMaintenanceRequests: "Rechercher des demandes de maintenance...",
  totalRequests: "Total des demandes",
  pendingRequests: "Demandes en attente",
  resolvedRequests: "Demandes résolues",
  noMaintenanceRequests: "Aucune demande de maintenance trouvée",
  createNewRequestToSee: "Créez une nouvelle demande de maintenance pour la voir ici.",
  deleteMaintenanceRequest: "Supprimer la demande de maintenance",
  // Missing tenant connection key
  notLinkedToTenant: "Vous n'êtes lié à aucun compte locataire",
  // Additional maintenance keys
  loading: "Chargement",
  authenticationRequired: "Authentification requise",
  pleaseSignIn: "Veuillez vous connecter pour continuer",
  accessDenied: "Accès refusé",
  tenantsOnly: "Cette section est réservée aux locataires",
  loadingMaintenanceInfo: "Chargement des informations de maintenance...",
  // Missing generic keys used throughout the app
  edit: "Modifier",
  delete: "Supprimer",
  title: "Titre",
  description: "Description",
  save: "Enregistrer",
  update: "Mettre à jour",
  create: "Créer",
  close: "Fermer",
  confirm: "Confirmer",
  // Validation and error messages
  pleaseSelectPriority: "Veuillez sélectionner une priorité",
  pleaseSelectStatus: "Veuillez sélectionner un statut",
  pleaseProvideDescription: "Veuillez fournir une description",
  pleaseFillAllFields: "Veuillez remplir tous les champs obligatoires",
  // Maintenance-specific error messages
  tenantIdMissing: "ID du locataire manquant",
  notAuthenticated: "Non authentifié",
  tenantNotFound: "Locataire introuvable",
  errorCreatingRequest: "Erreur lors de la création de la demande de maintenance",
  maintenanceRequestSubmitted: "Demande de maintenance soumise avec succès",
  errorSubmittingRequest: "Erreur lors de la soumission de la demande",
  // Additional form and validation keys
  required: "Obligatoire",
  optional: "Optionnel",
  selectOption: "Sélectionner une option",
  noOptionsAvailable: "Aucune option disponible",
  selectPriority: "Sélectionner la priorité",
  // Status and priority translations
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
  // Time and date
  created: "Créé",
  updated: "Mis à jour",
  createdAt: "Créé le",
  updatedAt: "Mis à jour le",
  createdOn: "Créé le",
  // Common actions
  viewDetails: "Voir les détails",
  viewAll: "Voir tout",
  showMore: "Voir plus",
  showLess: "Voir moins",
  refresh: "Actualiser",
  reload: "Recharger",
  retry: "Réessayer",
  // Additional maintenance keys
  newRequest: "Nouvelle demande",
  andMoreRequests: "et {count} de plus",
  manageMaintenanceRequests: "Gérez et suivez vos demandes de maintenance",
  // Photos and submission
  photos: "Photos",
  photosSelected: "photo(s) sélectionnée(s)",
  submitRequest: "Soumettre la demande",
  submitting: "Soumission..."
};

export default translations;
