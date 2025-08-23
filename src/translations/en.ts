
// Main English translations file - now using modular approach
import { enCommon } from './features/common';
import { enLanding } from './features/landing';
import { enProperties } from './features/properties';
import { enProperty } from './features/property';
import { enDashboard } from './features/dashboard';
import { enDocuments } from './features/documents';
import { enAuth } from './features/auth';
import { enFinances } from './features/finances';
import { enMaintenance } from './features/maintenance';
import { enTenant } from './features/tenant';
import { enSettings } from './features/settings';
import { enPricing, enPlanFeatures } from './features/pricing';
import { enNavigation } from './features/navigation';
import { enAdmin } from './features/admin';
import { en as enFeatures } from './features/en';
import { enList } from './features/tenant/en/list';
import { enPayments } from './features/tenant/en/payments';
import { enComingSoon } from './features/comingSoon';
import { enAI } from './features/ai';
import { enSecurity } from './features/security';

// Support extensions
const supportExtensions = {
  getSupport: "Get Support",
};


// Composer toutes les traductions en préservant la structure documentGenerator
const baseTranslations = {
  ...enCommon,
  ...enLanding,
  ...enProperties,
  ...enProperty,
  ...enDashboard,
  ...enAuth,
  ...enFinances,
  ...enMaintenance,
  ...enTenant,
  ...enList,
  ...enPayments,
  ...enSettings,
  ...enPricing,
  ...enPlanFeatures,
  ...enNavigation,
  ...enAdmin,
  ...enFeatures,
  ...enComingSoon,
  ...enAI,
  ...supportExtensions,
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
const flattenedSecurity = flattenObject(enSecurity, 'security');

// Extraire documentGenerator de enDocuments et l'ajouter séparément
const { documentGenerator, ...otherDocuments } = enDocuments;

const translations = {
  ...baseTranslations,
  ...otherDocuments,
  ...flattenedSecurity,
  documentGenerator: documentGenerator,
  // Ajouter downloadDocument à la racine pour compatibilité
  downloadDocument: documentGenerator.downloadDocument,
  // Traductions pour les catégories de documents tenant
  otherDocuments: "Other Documents",
  importantDocuments: "Important Documents", 
  leaseDocuments: "Lease Documents",
  paymentReceipts: "Payment Receipts",
  // Traductions pour l'upload de documents
  uploadDocument: "Upload Document",
  uploadNewDocument: "Add New Document",
  // Security disclaimer translations
  securityReminder: "Security Reminder:",
  securityDisclaimerText: "Never share sensitive information (passwords, credit card numbers, identity documents) through this application. Use secure channels for this type of information.",
  
  // Additional tenant list translations
  listBack: "Back",
  listSelectTenant: "Select a tenant to view details",
  unitLabel: "Unit",
  propertyNotFound: "Property not found",
  propertyError: "Error loading property",
  filters: "Filters",
  filterByProperty: "Filter by property",
  allProperties: "All properties",
  clearFilters: "Clear",
  saving: "Saving...",
  
  // Additional maintenance translations
  loadingProperties: "Loading properties...",
  
  // Tenant actions
  modify: "Modify",
  delete: "Delete", 
  invite: "Invite",
  noPropertyAssigned: "No property assigned",
  
  // Additional tenant list translations
  tenantsList: "Tenants",
  tenantsSubtitle: "Manage your tenants", 
  addTenant: "Add Tenant",
  noTenants: "No tenants found",
  noTenantsFiltered: "No tenants match the current filters",
  tenantCount: "{count} tenants",
  tenantCountSingular: "1 tenant",
  
  // Property form translations
  monthlyRent: "Monthly Rent ($)",
  dragImageHere: "Drag an image here or click to select",
  imageFormats: "PNG, JPG, GIF up to 10MB",
  createProperty: "Create Property",
  updateProperty: "Update Property",
  
  // Property table headers
  propertyName: "Property Name",
  address: "Address",
  type: "Type",
  units: "Units",
  occupation: "Occupation",
  createdAt: "Created",
  actions: "Actions",
  selectAll: "Select All",
  
  // Property actions bar
  propertySelected: "property selected",
  propertiesSelected: "properties selected",
  deleteSelected: "Delete",
  unselectAll: "Unselect",
  
  // Additional pricing plan features
  upTo1Property: "1 property",
  upTo1Tenant: "1 tenant",
  allStandardFeatures: "All Standard Plan benefits",
  
  // Common translations
  "common.backToHome": "Back to Home",
  
  // Generic security translations
  security: "Security",
  securityDesc: "Complete protection of your data with enterprise-grade encryption and access controls"
};


export default translations;
