
import { Translations } from './types';
import { enAdmin } from './features/admin';
import { enAuth } from './features/auth';
import { enCommon } from './features/common';
import { enContact } from './features/contact';
import { enCTA } from './features/cta';
import { enDashboard } from './features/dashboard';
import { enFAQ } from './features/faq';
import { enFeatures } from './features/features';
import { enFooter } from './features/footer';
import { enHero } from './features/hero';
import { enHowItWorks } from './features/how-it-works';
import { enMaintenance } from './features/maintenance';
import { enModal } from './features/modal';
import { enNavigation } from './features/navigation';
import { enPricing } from './features/pricing';
import { enProperty } from './features/property';
import { enSettings } from './features/settings';
import { enStatus } from './features/status';
import { enTenant } from './features/tenant';
import { enToasts } from './features/toasts';
import { enFinances } from './features/finances';
import { enVendors } from './features/maintenance/vendors';
import enDocumentGenerator from './features/documents/en';
import { enDocuments } from './features/tenant/en/documents';

// Import tenant dashboard translations
import { enDashboard as enTenantDashboard } from './features/tenant/en/dashboard';
// Import tenant maintenance translations - remove duplicate import
import { enMaintenance as enMaintenanceTenant } from './features/tenant/en/maintenance';

// Core translations object with essential keys to prevent crashes
const translations: any = {
  // Critical landing page keys (defined first to ensure availability)
  heroTitle: "Property Management Made Simple",
  heroSubtitle: "The complete solution for Canadian property owners. Manage tenants, maintenance, and finances all in one place.",
  heroGetStarted: "Get Started Free",
  learnMore: "Learn More",
  
  // Navigation essentials
  features: "Features",
  pricing: "Pricing",
  dashboard: "Dashboard",
  login: "Sign In",
  signOut: "Sign Out",
  
  // Footer essentials
  companyName: "PropManagement",
  companyDescription: "Simplifying property management for landlords and property managers",
  product: "Product",
  company: "Company",
  legal: "Legal",
  security: "Security",
  aboutUs: "About Us",
  careers: "Careers",
  contact: "Contact",
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  cookiePolicy: "Cookie Policy",
  allRightsReserved: "All rights reserved",
  
  // Features section essentials
  everythingYouNeed: "Everything You Need",
  featuresSubtitle: "Comprehensive tools designed for Canadian property management",
  propertyManagement: "Property Management",
  propertyManagementDesc: "Manage all your properties from one central dashboard",
  tenantManagement: "Tenant Management",
  tenantManagementDesc: "Keep track of tenants, leases, and communications",
  maintenanceDesc: "Schedule and track maintenance requests efficiently",
  securityDesc: "Your data is protected with enterprise-grade security",
  
  // CTA section essentials
  readyToStart: "Ready to Simplify Your Management?",
  joinOthers: "Join thousands of property owners who trust our solution",
  ctaStartFree: "Try For Free",
  
  // Now merge with imported translations (will override duplicates)
  ...enAdmin,
  ...enAuth,
  ...enCommon,
  ...enContact,
  ...enCTA,
  ...enDashboard,
  ...enFAQ,
  ...enFeatures,
  ...enFooter,
  ...enHero,
  ...enHowItWorks,
  ...enModal,
  ...enNavigation,
  ...enPricing,
  ...enProperty,
  ...enSettings,
  ...enStatus,
  ...enTenant,
  ...enToasts,
  ...enFinances,
  ...enVendors,
  ...enMaintenance,
  
  // Tenant-specific overrides
  ...enTenantDashboard,
  documentGenerator: enDocumentGenerator,
  documents: enDocuments,
  
  // Add tenant maintenance translations at root level for direct access
  maintenance: enMaintenanceTenant,
  
  // Additional common translations
  searchTenants: "Search tenants...",
  securityDeposit: "Security Deposit",
  deposited: "Deposited",
  notDeposited: "Not deposited",
  emailProfileLabel: "Email Address",
  phoneProfileLabel: "Phone Number",
  rentAmountLabel: "Rent Amount",
  leaseStartProfileLabel: "Lease Start Date",
  leaseEndProfileLabel: "Lease End Date",
  depositStatusUpdated: "Deposit status updated",
  invite: "Invite",
  inviteTenant: "Invite Tenant",
  perMonth: "per month",
  error: 'Error',
  success: 'Success',
  tenantAdded: 'Tenant added successfully',
  errorLoadingTenantData: 'Error loading tenant data',
  invalidEmail: 'Invalid email address',
  invalidAmount: 'Invalid amount',
  welcomeTenant: "Welcome, {name}",
  manageApartmentInfo: "Manage your apartment information and communications",
  darkMode: "Dark Mode",
  customizeDashboard: "Customize Dashboard",
  customizeDashboardDescription: "Choose which widgets to display and their order",
  maintenanceRequests: "Maintenance Requests",
  newMaintenanceRequest: "New Maintenance Request",
  maintenanceRequestTitlePlaceholder: "e.g., Water leak in bathroom",
  maintenanceDescriptionPlaceholder: "Describe the maintenance issue in detail...",
  editMaintenanceRequest: "Edit Maintenance Request",
  searchMaintenanceRequests: "Search maintenance requests...",
  totalRequests: "Total Requests",
  pendingRequests: "Pending Requests",
  resolvedRequests: "Resolved Requests",
  noMaintenanceRequests: "No maintenance requests found",
  createNewRequestToSee: "Create a new maintenance request to see it here.",
  deleteMaintenanceRequest: "Delete Maintenance Request",
  notLinkedToTenant: "You are not linked to any tenant account",
  loading: "Loading",
  authenticationRequired: "Authentication Required",
  pleaseSignIn: "Please sign in to continue",
  accessDenied: "Access Denied",
  tenantsOnly: "This section is for tenants only",
  loadingMaintenanceInfo: "Loading maintenance information...",
  edit: "Edit",
  delete: "Delete",
  title: "Title",
  description: "Description",
  cancel: "Cancel",
  save: "Save",
  update: "Update",
  create: "Create",
  close: "Close",
  confirm: "Confirm",
  pleaseSelectPriority: "Please select a priority",
  pleaseSelectStatus: "Please select a status",
  pleaseProvideDescription: "Please provide a description",
  pleaseFillAllFields: "Please fill all required fields",
  tenantIdMissing: "Tenant ID is missing",
  notAuthenticated: "Not authenticated",
  tenantNotFound: "Tenant not found",
  errorCreatingRequest: "Error creating maintenance request",
  maintenanceRequestSubmitted: "Maintenance request submitted successfully",
  errorSubmittingRequest: "Error submitting maintenance request",
  maintenanceRequestUpdated: "Maintenance request updated successfully",
  errorUpdatingRequest: "Error updating maintenance request",
  required: "Required",
  optional: "Optional",
  selectOption: "Select an option",
  noOptionsAvailable: "No options available",
  selectPriority: "Select priority",
  status: "Status",
  priority: "Priority",
  pending: "Pending",
  inProgress: "In Progress",
  resolved: "Resolved",
  completed: "Completed",
  cancelled: "Cancelled",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
  created: "Created",
  updated: "Updated",
  createdAt: "Created at",
  updatedAt: "Updated at",
  createdOn: "Created on",
  viewDetails: "View Details",
  viewAll: "View All",
  showMore: "Show More",
  showLess: "Show Less",
  refresh: "Refresh",
  reload: "Reload",
  retry: "Retry",
  newRequest: "New Request",
  andMoreRequests: "and {count} more",
  manageMaintenanceRequests: "Manage and track your maintenance requests",
  photos: "Photos",
  photosSelected: "photo(s) selected",
  submitRequest: "Submit Request",
  submitting: "Submitting...",
  updateRequest: "Update Request",
  updating: "Updating...",
  newUpdate: "new update",
  newUpdates: "new updates",
  leaseStatusExpiringDays: "Expires in {days} days",
  leaseStatusExpired: "Expired {days} days ago",
  daysLeft: "{days} days left",
  daysAgo: "{days} days ago",
  andMoreMessages: "and {count} more messages",
  andMoreDocuments: "and {count} more documents",
  welcomeGeneric: "Welcome to your dashboard",
  lightMode: "Light Mode",
  viewAllDocuments: "View All Documents",
  noDocuments: "No documents available",
  noCommunications: "No communications",
  allMessages: "All Messages",
  newMessage: "New Message",
  sentByYou: "Sent by you",
  noPaymentHistory: "No payment history available",
  amount: "Amount",
  paymentHistory: "Payment History",
  paid: "Paid",
  overdue: "Overdue",
  unitLabel: "Unit",
  lease: {
    start: "Lease Start",
    end: "Lease End"
  },
  leaseStatusActive: "Active Lease",
  overview: "Overview"
};

export default translations;
