
import { frCommon } from './common';
import { frDashboard } from './dashboard';
import { frAuth } from './auth';
import { frFinances } from './finances';
import { frMaintenance } from './maintenance';
import { frSettings } from './settings';
import { frLease } from './tenant/fr/lease';
import { frDashboard as frTenantDashboard } from './tenant/fr/dashboard';
import { frToasts } from './toasts';
import { frAdmin } from './admin';

export const fr = {
  ...frCommon,
  ...frDashboard,
  ...frAuth,
  ...frFinances,
  ...frMaintenance,
  ...frSettings,
  ...frToasts,
  ...frAdmin,
  
  // Lease translations
  ...frLease,
  
  // Tenant dashboard translations
  ...frTenantDashboard,
  
  // Additional lease management translations
  leaseExpiry: "Expiration du bail",
  leaseExpiryManagement: "Gestion de l'expiration des baux",
  leaseExpiryNotifications: "Notifications d'expiration de bail",
  enableLeaseReminders: "Activer les rappels de bail",
  reminderSettings: "Paramètres de rappel",
  daysBeforeExpiry: "Jours avant expiration",
  notificationMethod: "Méthode de notification",
  emailAndApp: "Email et App",
  emailOnly: "Email uniquement",
  appOnly: "App uniquement",
  leaseStatus: "Statut du bail",

  // Admin translations
  user: "Utilisateur",
  role: "Rôle",
  roles: "Rôles",
  systemSettings: "Paramètres système",
  roleManagement: "Gestion des rôles",
  manageUserRoles: "Gérer les rôles des utilisateurs",
  admin: "Administrateur",
  moderator: "Modérateur",
  assignRole: "Attribuer un rôle",
  removeRole: "Supprimer le rôle",
  totalUsers: "Total des utilisateurs",
  usersWithRoles: "Utilisateurs avec rôles",
  roleDistribution: "Répartition des rôles",
  
  // Reports translations
  revenueEvolution: "Évolution des Revenus",
  maintenanceByPriority: "Maintenance par Priorité",
  maintenanceByStatus: "Maintenance par Statut",
  occupancyTrends: "Tendances d'Occupation",
  currentOccupancy: "Occupation Actuelle",
  activeTenants: "Locataires Actifs",
  totalUnits: "Unités Totales",
  
  // Analytics translations
  analyticsOverview: "Vue d'ensemble Analytics",
  comprehensiveAnalytics: "Analyse complète de vos données immobilières",
  
  // Financial Reports translations
  financialReports: "Rapports Financiers",
  comprehensiveFinancialAnalysis: "Analyse financière complète",
  financialOverviewByProperty: "Vue d'ensemble par propriété",
  totalExpenses: "Dépenses Totales",
  netIncome: "Revenu Net",
  roi: "ROI sur dépenses",
  totalRevenueTooltip: "Somme de tous les paiements de loyers reçus des locataires sur la période sélectionnée.",
  totalExpensesTooltip: "Montant total des dépenses de maintenance et autres frais liés à la gestion de vos propriétés.",
  netIncomeTooltip: "Différence entre les revenus totaux et les dépenses totales. Indique la rentabilité réelle de vos propriétés.",
  roiTooltip: "Retour sur investissement calculé comme (Revenu Net / Dépenses Totales) × 100. Mesure l'efficacité de vos dépenses.",
  noPropertiesFound: "Aucune propriété trouvée",
  
  // Property Reports translations
  propertyReports: "Rapports par Propriété",
  detailedPropertyAnalysis: "Analyse détaillée par propriété",
  propertySummary: "Résumé des Propriétés",
  property: "Propriété",
  type: "Type",
  units: "Unités",
  occupied: "Occupé",
  occupancy: "Occupation",
  
  // Tenant Reports translations
  tenantReports: "Rapports Locataires",
  detailedTenantAnalysis: "Analyse détaillée des locataires",
  leaseExpiryAlerts: "Alertes Fin de Bail",
  sendReminder: "Envoyer rappel",
  noUpcomingLeaseExpiry: "Aucune fin de bail prochaine",
  rentAmount: "Loyer",
  unit: "Unité",
  totalPaid: "Total payé",
  lastPayment: "Dernier paiement",
  expired: "Expiré",
  payments: "paiements",
  unread: "non lu",
  daysRemaining: "jours restants",
  
  // Performance Metrics translations
  performanceMetrics: "Métriques de Performance",
  keyPerformanceIndicators: "Indicateurs clés de performance",
  paymentRate: "Taux de Paiement",
  maintenanceEfficiency: "Efficacité Maintenance",
  target: "Objectif",
  ofTarget: "de l'objectif",
  occupancyBreakdown: "Répartition de l'Occupation",
  occupiedUnits: "Unités occupées",
  vacantUnits: "Unités vacantes",
  financialPerformance: "Performance Financière",
  averageRent: "Loyer moyen",
  onTimePayments: "Paiements à temps",
  latePayments: "Paiements en retard",
  
  // Export Options translations
  exportExcel: "Exporter Excel",
  exportPDF: "Exporter PDF",
  shareByEmail: "Partager par email",
  shareReport: "Partager le rapport",
  recipientEmail: "Email du destinataire",
  
  // Property types translations
  apartment: "Appartement",
  house: "Maison",
  condo: "Condo",
  propertyOffice: "Bureau",
  commercialspace: "Espace Commercial",
  
  // Financial Overview translations
  financialOverview: "Vue d'ensemble financière",
  income: "Revenus",
  expenses: "Dépenses",
  noIncomeData: "Aucune donnée de revenus disponible",
  noExpenseData: "Aucune donnée de dépenses disponible",
  
  // Property Selector translations
  noPropertiesAvailable: "Aucune propriété disponible",
  selectProperty: "Sélectionner une propriété",
  
  // Table columns
  date: "Date",
  tenant: "Locataire",
  unitNumber: "Numéro d'unité",
  amount: "Montant",
  status: "Statut",
  category: "Catégorie",
  description: "Description",
  
  // Supabase Logs translations
  supabaseLogs: "Logs Supabase",
  edgeFunctionsLogs: "Logs Edge Functions",
  authLogs: "Logs Authentification",
  databaseLogs: "Logs Base de Données",
  noLogsAvailable: "Aucun log disponible",
  metadata: "Métadonnées",
  
  // Priority translations
  urgent: "Urgent",
  high: "Élevé",
  medium: "Moyen",
  low: "Faible",
  
  // Status translations
  pending: "En attente",
  in_progress: "En cours",
  completed: "Terminé",
  paid: "Payé",
  overdue: "En retard",
  
  // Metrics translations
  occupancyRateDescription: "Année en cours",
  yearToDate: "Année en cours",
  totalRentPaid: "Total des loyers payés",
  
  // Maintenance Overview translations
  loadingData: "Chargement des données...",
  totalRequestsDescription: "Total des demandes",
  pendingRequestsDescription: "En cours de traitement",
  resolvedRequestsDescription: "Demandes résolues",
  maintenanceRequestsTrends: "Tendances des demandes de maintenance",
  maintenanceExpensesTrends: "Tendances des dépenses de maintenance",
  errorLoadingData: "Erreur lors du chargement des données",
  retry: "Réessayer",
  
  // Maintenance Requests Section translations
  maintenanceRequestsTitle: "Demandes de maintenance",
  manageMaintenanceRequests: "Gérez toutes les demandes de maintenance",
  loading: "Chargement...",
  viewOtherRequests: "Voir {count} autre{s} demande{s}",
  viewMoreRequests: "Voir plus de demandes",
  
  // Maintenance Vendors Section translations
  manageVendorsAndInterventions: "Gérez vos prestataires et leurs interventions",
  
  // Maintenance Finances Section translations
  financesTitle: "Dépenses",
  trackAndManageExpenses: "Suivez et gérez toutes vos dépenses de maintenance",
  propertySelectionRequired: "Sélection de propriété requise",
  selectPropertyToManageExpenses: "Veuillez sélectionner une propriété pour gérer les dépenses",
  selectPropertyPlaceholder: "Sélectionner une propriété",
  noPropertiesFoundMessage: "Aucune propriété trouvée. Ajoutez d'abord une propriété pour gérer les dépenses.",
  selectPropertyToViewExpenses: "Sélectionnez une propriété pour voir et gérer les dépenses.",
  averageMonthlyExpenses: "Dépenses mensuelles moyennes",
  thisMonth: "Ce mois",
  pleaseSelectProperty: "Veuillez sélectionner une propriété",
  
  // Maintenance Navigation translations
  maintenanceOverview: "Vue d'ensemble",
  maintenanceRequests: "Demandes", 
  maintenanceTasks: "Tâches",
  maintenanceVendors: "Prestataires",
  maintenanceExpenses: "Dépenses",
};
