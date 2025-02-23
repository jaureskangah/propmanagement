
export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

// Navigation translations
export interface NavigationTranslations {
  features: string;
  pricing: string;
  freeTrial: string;
  signIn: string;
  signOut: string;
  dashboard: string;
  language: string;
  units: string;
  metric: string;
  imperial: string;
}

// Hero translations
export interface HeroTranslations {
  heroTitle: string;
  heroSubtitle: string;
  heroGetStarted: string;
  learnMore: string;
}

// Features translations
export interface FeaturesTranslations {
  everythingYouNeed: string;
  featuresSubtitle: string;
  propertyManagement: string;
  propertyManagementDesc: string;
  tenantManagement: string;
  tenantManagementDesc: string;
  maintenance: string;
  maintenanceDesc: string;
  security: string;
  securityDesc: string;
}

// Maintenance translations
export interface MaintenanceTranslations {
  maintenanceManagement: string;
  maintenanceRequestTitle: string;
  maintenanceCalendar: string;
  preventiveMaintenance: string;
  workOrders: string;
  costs: string;
  vendors: string;
  regularTask: string;
  inspection: string;
  seasonalTask: string;
  taskTitle: string;
  deadline: string;
  taskType: string;
  selectType: string;
  addNewTask: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  priorityUrgent: string;
  statusCompleted: string;
  statusPending: string;
  statusInProgress: string;
  maintenanceTitle: string;
  maintenanceDescription: string;
  maintenancePrioritySelect: string;
  maintenancePhotos: string;
  photosSelected: string;
  submit: string;
  cancel: string;
  submitting: string;
  delete: string;
  edit: string;
  confirmDelete: string;
  deleteWarning: string;
  createdOn: string;
  confirmSubmit: string;
  confirmEdit: string;
  uploadPhotos: string;
  dropPhotos: string;
  maintenanceType: string;
  requiredField: string;
  requestSaved: string;
  requestDeleted: string;
  requestUpdated: string;
  areYouSure: string;
  viewPhotos: string;
  closePhotos: string;
  emergency: string;
  routine: string;
  cosmetic: string;
  viewHistory: string;
  addNote: string;
  saveNote: string;
  noteSaved: string;
  scheduledTasks: string;
  addTask: string;
  noMaintenanceRequests: string;
}

// Status translations
export interface StatusTranslations {
  status: string;
  priority: string;
}

export interface Translations extends 
  NavigationTranslations,
  HeroTranslations,
  FeaturesTranslations,
  PricingTranslations,
  PlanFeaturesTranslations,
  ToastTranslations,
  ContactTranslations,
  AuthTranslations,
  CTATranslations,
  FAQTranslations,
  AdminDashboardTranslations,
  MaintenanceTranslations,
  StatusTranslations {}
