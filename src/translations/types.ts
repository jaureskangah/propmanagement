
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

// Pricing translations
export interface PricingTranslations {
  freemiumPlan: string;
  proPlan: string;
  enterprisePlan: string;
  free: string;
  month: string;
  mostPopular: string;
  pricingTitle: string;
  pricingSubtitle: string;
  pricingStartFree: string;
  pricingGetStarted: string;
}

// Plan features translations
export interface PlanFeaturesTranslations {
  upTo2Properties: string;
  upTo5Properties: string;
  upTo20Properties: string;
  rentManagement: string;
  digitalDocuments: string;
  basicPropertyCards: string;
  emailNotifications: string;
  tenantVerification: string;
  prioritySupport: string;
  advancedDashboard: string;
  financialReports: string;
  maintenanceManagement: string;
  dedicatedSupport: string;
  customDashboard: string;
  advancedFinancialReports: string;
  userTraining: string;
  dailyBackup: string;
}

// Toast translations
export interface ToastTranslations {
  authRequired: string;
  pleaseSignInToSubscribe: string;
  processing: string;
  preparingPaymentSession: string;
  error: string;
  failedToCreateSession: string;
  failedToCreateSessionNoUrl: string;
  generalError: string;
}

// Contact translations
export interface ContactTranslations {
  contactUs: string;
  contactSubtitle: string;
  phone: string;
  email: string;
  office: string;
  sendMessage: string;
  yourName: string;
  yourEmail: string;
  message: string;
  sending: string;
  send: string;
}

// Auth translations
export interface AuthTranslations {
  welcome: string;
  authDescription: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  iAmTenant: string;
  register: string;
  processingRegistration: string;
  processingLogin: string;
}

// Call to action translations
export interface CTATranslations {
  readyToStart: string;
  joinOthers: string;
  ctaStartFree: string;
}

// FAQ translations
export interface FAQTranslations {
  frequentlyAskedQuestions: string;
  findAnswers: string;
  faqHowToStart: string;
  faqHowToStartAnswer: string;
  faqFeatures: string;
  faqFeaturesAnswer: string;
  faqMultipleProperties: string;
  faqMultiplePropertiesAnswer: string;
  faqCommunication: string;
  faqCommunicationAnswer: string;
  faqSecurity: string;
  faqSecurityAnswer: string;
  faqExport: string;
  faqExportAnswer: string;
}

// Admin Dashboard translations
export interface AdminDashboardTranslations {
  adminDashboard: string;
  totalUsers: string;
  activeUsers: string;
  properties: string;
  totalRevenue: string;
  userGrowth: string;
  revenueGrowth: string;
  downloadData: string;
  shareData: string;
  downloadSuccess: string;
  downloadError: string;
  shareSuccess: string;
  copySuccess: string;
  shareError: string;
}

// Maintenance translations
export interface MaintenanceTranslations {
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
  maintenanceManagement: string;
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
