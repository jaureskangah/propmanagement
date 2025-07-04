
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

// Maintenance-specific translations that aren't in the module yet
const maintenanceExtensions = {
  maintenanceRequests: "Demandes de Maintenance",
  newMaintenanceRequest: "Nouvelle Demande de Maintenance",
  totalRequests: "Total des Demandes",
  pendingRequests: "Demandes en Attente",
  resolvedRequests: "Demandes Résolues",
  noMaintenanceRequestsFound: "Aucune demande de maintenance trouvée",
  createNewRequestToSee: "Créez une nouvelle demande de maintenance pour la voir ici.",
  deleteMaintenanceRequest: "Supprimer la Demande de Maintenance",
  maintenanceRequestTitlePlaceholder: "ex., Fuite d'eau dans la salle de bain",
  maintenanceDescriptionPlaceholder: "Décrivez le problème de maintenance en détail...",
  submitRequest: "Soumettre la Demande",
  updateRequest: "Mettre à jour la Demande",
  editMaintenanceRequest: "Modifier la Demande de Maintenance",
  selectPriority: "Sélectionner la priorité",
  selectStatus: "Sélectionner le statut",
  maintenanceRequestSubmitted: "Demande de maintenance soumise avec succès",
  maintenanceRequestUpdated: "Demande de maintenance mise à jour avec succès",
  errorSubmittingRequest: "Erreur lors de la soumission de la demande de maintenance",
  errorUpdatingRequest: "Erreur lors de la mise à jour de la demande de maintenance",
  maintenanceTitle: "Maintenance",
  manageMaintenanceRequests: "Gérez et suivez vos demandes de maintenance",
  authenticationRequired: "Authentification Requise",
  pleaseSignIn: "Veuillez vous connecter pour continuer",
  accessDenied: "Accès Refusé",
  tenantsOnly: "Cette page est réservée aux locataires",
  loadingMaintenanceInfo: "Chargement des informations de maintenance...",
  notLinkedToTenant: "Vous n'êtes pas lié à un profil de locataire",
  pleaseSelectPriority: "Veuillez sélectionner une priorité",
  pleaseSelectStatus: "Veuillez sélectionner un statut",
  pleaseProvideDescription: "Veuillez fournir une description",
  
  // Types de tâches pour la maintenance
  plumbing: "Plomberie",
  electrical: "Électricité", 
  hvac: "CVC",
  appliance: "Électroménager",
  structural: "Structurel",
  painting: "Peinture",
  flooring: "Revêtement de Sol",
  cleaning: "Nettoyage",
  landscaping: "Aménagement Paysager",
  securityMaintenance: "Sécurité",
  other: "Autre",
  general: "Général",
  inspection: "Inspection",
  preventive: "Préventif",
  regularTask: "Tâche Régulière",
  seasonalTask: "Tâche Saisonnière",
  maintenanceTask: "Tâche de Maintenance",
};

// Extensions spécifiques aux locataires
const tenantExtensions = {
  // Tableau de bord
  welcomeTenant: "Bienvenue, {name}",
  welcomeGeneric: "Bienvenue sur votre tableau de bord",
  manageApartmentInfo: "Gérez les informations de votre appartement et communications",
  
  // Informations de bail
  lease: {
    start: "Début du Bail",
    end: "Fin du Bail"
  },
  leaseStatus: "Statut du Bail",
  leaseStatusActive: "Bail Actif",
  leaseStatusExpiringDays: "Expire dans {days} jours",
  leaseStatusExpired: "Expiré il y a {days} jours",
  leaseActive: "Bail Actif",
  leaseExpiring: "Bail Expirant",
  leaseExpired: "Bail Expiré",
  leaseStart: "Début du Bail",
  leaseEnd: "Fin du Bail",
  daysLeft: "{days} jours restants",
  daysAgo: "il y a {days} jours",
  daysRemaining: "Jours Restants",
  
  // Communications
  communications: "Communications",
  noCommunications: "Aucune communication",
  allMessages: "Tous les Messages",
  newMessage: "Nouveau Message",
  sentByYou: "Envoyé par vous",
  andMoreMessages: "et {count} messages de plus",
  
  // Paiements
  payments: "Paiements",
  payment: "Paiement",
  paymentHistory: "Historique des Paiements",
  noPaymentHistory: "Aucun historique de paiement disponible",
  paid: "Payé",
  overdue: "En Retard",
  
  // Informations de propriété
  unitLabel: "Unité",
  unit: "Unité",
  rentAmountLabel: "Montant du Loyer",
  
  // Messagerie directe
  messageCantBeEmpty: "Le message ne peut pas être vide",
  maintenanceIssue: "Problème de Maintenance",
  messageSent: "Message envoyé avec succès",
  errorSendingMessage: "Erreur lors de l'envoi du message",
  directMessaging: "Messagerie Directe",
  noMessages: "Aucun message encore",
  fromProperty: "De la Propriété",
  typeYourMessage: "Tapez votre message ici...",
  
  // Identification du locataire
  tenant: "Locataire",
  
  // Commentaires supplémentaires des locataires
  rating: "Évaluation",
  comments: "Commentaires",
  feedbackPlaceholder: "Veuillez partager vos commentaires sur les travaux de maintenance...",
};

// Traductions financières
const financialExtensions = {
  revenueAndExpenses: "Revenus et Dépenses",
  monthly: "Mensuel",
  yearly: "Annuel",
  dataBeingRefreshed: "Les données sont en cours d'actualisation",
  errorLoadingData: "Erreur lors du chargement des données",
  profit: "Profit",
  
  // Spécifique à la page financière
  selectProperty: "Sélectionner une Propriété",
  selectYear: "Sélectionner une Année",
  noPropertySelected: "Aucune propriété sélectionnée",
  pleaseSelectProperty: "Veuillez sélectionner une propriété pour voir les données financières",
  financialMetrics: "Métriques Financières",
  incomeVsExpenses: "Revenus vs Dépenses",
  monthlyBreakdown: "Répartition Mensuelle",
  yearlyBreakdown: "Répartition Annuelle",
  totalRevenue: "Revenus Totaux",
  totalCosts: "Coûts Totaux",
  netProfit: "Profit Net",
  profitMargin: "Marge de Profit",
  averageMonthlyIncome: "Revenus Mensuels Moyens",
  averageMonthlyExpenses: "Dépenses Mensuelles Moyennes",
  financialTrends: "Tendances Financières",
  incomeGrowth: "Croissance des Revenus",
  expenseGrowth: "Croissance des Dépenses",
  cashFlow: "Flux de Trésorerie",
  positiveFlow: "Flux Positif",
  negativeFlow: "Flux Négatif",
  breakEvenPoint: "Point d'Équilibre",
  returnOnInvestment: "Retour sur Investissement",
  
  // Mois du graphique
  jan: "Jan", feb: "Fév", mar: "Mar", apr: "Avr", may: "Mai", jun: "Juin",
  jul: "Juil", aug: "Août", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Déc",
  
  // Filtres financiers
  filterByProperty: "Filtrer par Propriété",
  filterByYear: "Filtrer par Année",
  showAll: "Afficher Tout",
  thisYearData: "Données de Cette Année",
  lastYearData: "Données de l'Année Dernière",
  compareWithPrevious: "Comparer avec l'Année Précédente",
  
  // Termes financiers
  income: "Revenus",
  rental: "Location",
  utilities: "Services Publics",
  insurance: "Assurance",
  taxes: "Taxes",
  repairs: "Réparations",
  vacancy: "Vacance",
  propertyValue: "Valeur de la Propriété",
  appreciation: "Appréciation",
  depreciation: "Dépréciation",
  yearToDate: "Année à ce Jour",
  roi: "RSI",
  annualReturn: "Rendement Annuel",
  totalRentPaid: "Total des Loyers Payés",
  paymentEvolution: "Évolution des Paiements",
  cumulativeTotal: "Total Cumulatif",
  late: "En Retard",
};

// Support
const supportExtensions = {
  getSupport: "Obtenir du Support",
};

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
  ...maintenanceExtensions,
  ...tenantExtensions,
  ...financialExtensions,
  ...supportExtensions,
  
  // Traductions manquantes qui doivent être ajoutées aux modules appropriés plus tard
  noMaintenanceIssues: "Aucun problème de maintenance",
  allGood: "Tout Va Bien",
};

export default translations;
