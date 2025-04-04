
export interface DashboardTranslations {
  recentActivity: string;
  upcomingPayments: string;
  occupancyRate: string;
  maintenanceRequests: string;
  totalRevenue: string;
  noActivity: string;
  noUpcomingPayments: string;
  loading: string;
  error: string;
  refresh: string;
  darkMode: string;
  lightMode: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  viewAll: string;
  filterBy: string;
  sortBy: string;
  date: string;
  amount: string;
  status: string;
  tenant: string;
  property: string;
  unit: string;
  dueDate: string;
  paid: string;
  pending: string;
  overdue: string;
  occupied: string;
  vacant: string;
  total: string;
  chartRevenue: string;  // Changed from nested object to flat structure
  chartExpenses: string;
  chartProfit: string;
  
  // Ajout des clés pour le filtre de dates
  lastMonth: string;
  last3Months: string;
  last6Months: string;
  thisYear: string;
  lastYear: string;
  
  // Ajout des clés pour les tâches planifiées
  noScheduledTasks: string;
  scheduledTasks: string;
  urgent: string;
  high: string;
  medium: string;
  low: string;
  regularTask: string;
  inspection: string;
  seasonalTask: string;
  
  // Ajout de la clé pour "all"
  all: string;
  
  // Ajout de la clé pour "yesterday"
  yesterday: string;
  
  // Export options
  export: string;
  exportCSV: string;
  exportPDF: string;
  
  // Activity filtering translations
  resetFilter: string;
  refreshActivities: string;
  noActivityFiltered: string;
  filterReset: string;
  refreshing: string;
}
