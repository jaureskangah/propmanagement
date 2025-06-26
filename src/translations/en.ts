

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

// Créer un objet de traduction unique qui résout les conflits
const translations: any = {
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
  ...enMaintenance,
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
  // Tenant dashboard translations (override with tenant-specific ones)
  ...enTenantDashboard,
  documentGenerator: enDocumentGenerator,
  documents: enDocuments,
  // Add tenant maintenance translations at root level for direct access
  maintenance: enMaintenanceTenant,
  // Translations for tenant page
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
  // Add generic keys for error messages
  error: 'Error',
  success: 'Success',
  tenantAdded: 'Tenant added successfully',
  errorLoadingTenantData: 'Error loading tenant data',
  invalidEmail: 'Invalid email address',
  invalidAmount: 'Invalid amount',
  // Missing tenant dashboard keys
  welcomeTenant: "Welcome, {name}",
  manageApartmentInfo: "Manage your apartment information and communications",
  darkMode: "Dark Mode",
  customizeDashboard: "Customize Dashboard",
  customizeDashboardDescription: "Choose which widgets to display and their order",
  // Maintenance-specific keys from tenant maintenance - expose at root level
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
  // Missing tenant connection key
  notLinkedToTenant: "You are not linked to any tenant account",
  // Additional maintenance keys
  loading: "Loading",
  authenticationRequired: "Authentication Required",
  pleaseSignIn: "Please sign in to continue",
  accessDenied: "Access Denied",
  tenantsOnly: "This section is for tenants only",
  loadingMaintenanceInfo: "Loading maintenance information...",
  // Missing generic keys used throughout the app
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
  // Validation and error messages
  pleaseSelectPriority: "Please select a priority",
  pleaseSelectStatus: "Please select a status",
  pleaseProvideDescription: "Please provide a description",
  pleaseFillAllFields: "Please fill all required fields",
  // Maintenance-specific error messages
  tenantIdMissing: "Tenant ID is missing",
  notAuthenticated: "Not authenticated",
  tenantNotFound: "Tenant not found",
  errorCreatingRequest: "Error creating maintenance request",
  maintenanceRequestSubmitted: "Maintenance request submitted successfully",
  errorSubmittingRequest: "Error submitting maintenance request",
  maintenanceRequestUpdated: "Maintenance request updated successfully",
  errorUpdatingRequest: "Error updating maintenance request",
  // Additional form and validation keys
  required: "Required",
  optional: "Optional",
  selectOption: "Select an option",
  noOptionsAvailable: "No options available",
  selectPriority: "Select priority",
  // Status and priority translations
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
  // Time and date
  created: "Created",
  updated: "Updated",
  createdAt: "Created at",
  updatedAt: "Updated at",
  createdOn: "Created on",
  // Common actions
  viewDetails: "View Details",
  viewAll: "View All",
  showMore: "Show More",
  showLess: "Show Less",
  refresh: "Refresh",
  reload: "Reload",
  retry: "Retry",
  // Additional maintenance keys
  newRequest: "New Request",
  andMoreRequests: "and {count} more",
  manageMaintenanceRequests: "Manage and track your maintenance requests",
  // Photos and submission
  photos: "Photos",
  photosSelected: "photo(s) selected",
  submitRequest: "Submit Request",
  submitting: "Submitting...",
  updateRequest: "Update Request",
  updating: "Updating...",
  // Missing keys used in MaintenanceWidget
  newUpdate: "new update",
  newUpdates: "new updates"
};

export default translations;

