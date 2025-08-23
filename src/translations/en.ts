
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
  securityDesc: "Complete protection of your data with enterprise-grade encryption and access controls",
  
  // About page translations
  "about.title": "About PropManagement",
  "about.description": "PropManagement is dedicated to simplifying property management for landlords and property managers. Our platform streamlines the entire property management process, from tenant screening to maintenance requests.",
  "about.mission.title": "Our Mission",
  "about.mission.description": "To provide innovative solutions that make property management more efficient, transparent, and profitable for property owners while ensuring a better experience for tenants.",
  "about.values.title": "Our Values",
  "about.values.innovation.title": "Innovation:",
  "about.values.innovation.description": "Continuously improving our platform with cutting-edge technology.",
  "about.values.integrity.title": "Integrity:",
  "about.values.integrity.description": "Operating with transparency and honesty in all our dealings.",
  "about.values.customerFocus.title": "Customer Focus:",
  "about.values.customerFocus.description": "Putting our users' needs first in everything we do.",
  
  // Careers page translations
  "careers.title": "Join Our Team",
  "careers.subtitle": "Help us revolutionize property management while building your career with a team that values innovation, collaboration, and growth.",
  "careers.viewPositions": "View Our Opportunity",
  "careers.whyJoinUs": "Why Join PropManagement?",
  "careers.opportunityTitle": "Co-Founder Opportunity",
  
  // Job offer
  "job.title": "Right-Hand / Co-Founder – PropManagement",
  "job.location": "Moncton (NB) – hybrid/remote possible",
  "job.type": "Co-founder / Equity Partner",
  "job.availability": "Immediate",
  
  // About PropManagement section
  "job.aboutPropManagement": "About PropManagement",
  "job.aboutPropManagementDesc": "PropManagement is a SaaS platform designed to help small landlords manage their rental properties simply, quickly, and effectively. Our mission is clear: \"Manage more, stress less.\"",
  
  "job.propManagementFeatures": "With PropManagement, landlords can:",
  "job.collectRent": "Collect rent online 💰",
  "job.trackMaintenance": "Track maintenance requests 🔧", 
  "job.communicateWithTenants": "Communicate seamlessly with tenants 📩",
  "job.centralizeDocuments": "Centralize all their property documents 📂",
  
  "job.accelerateProgram": "We've recently joined the Accelerate Tech 2025/26 program by Tribe Network, marking a key milestone in our journey.",
  
  // The role section
  "job.theRole": "The Role",
  "job.roleDescription": "We are looking for a right-hand / co-founder to join the adventure and help accelerate PropManagement's growth. Your role will include:",
  
  "job.operationsOrg": "Operations & organization: Structuring internal processes and ensuring goal tracking.",
  "job.growthAcquisition": "Growth & acquisition: Developing and executing marketing, partnerships, and sales strategies.",
  "job.userRelations": "User relations: Supporting our first landlords, gathering feedback, and improving customer experience.",
  "job.fundraisingPartnerships": "Fundraising & partnerships: Helping prepare pitch decks, meeting investors, and building strategic alliances.",
  
  // Who you are section
  "job.whoYouAre": "Who You Are",
  "job.entrepreneurHeart": "An entrepreneur at heart, eager to join an early-stage startup.",
  "job.experiencedInterested": "Experienced or highly interested in digital marketing, business development, or project management.",
  "job.practicalOriented": "Practical and solution-oriented, able to handle diverse responsibilities independently.",
  "job.motivatedImpact": "Motivated by having a direct impact on a project's success and building something meaningful from the ground up.",
  "job.comfortableLean": "Comfortable working in a lean environment (limited resources, big ambitions 💡).",
  
  // What we offer section
  "job.whatWeOffer": "What We Offer",
  "job.coFounderOpportunity": "The opportunity to become a co-founder of a high-potential PropTech startup.",
  "job.equityOwnership": "Equity (ownership) in the company, negotiable based on commitment.",
  "job.centralRole": "A central role in transforming property management for small landlords in Canada.",
  "job.networkAccess": "Access to a strong network of experts, mentors, and investors through the Accelerate Tech program.",
  
  // How to apply section
  "job.howToApply": "How to Apply",
  "job.applyDescription": "If you want to join this journey and become the key partner of PropManagement, get in touch:",
  "job.applyEmail": "contact@propmanagement.app",
  "job.applyLinkedIn": "https://www.linkedin.com/in/jaureskangah/",
  "job.applyInstructions": "Tell us about your background, your motivation, and what you could bring to the project.",
  "job.buildTogether": "Let's build together the solution small landlords have been waiting for!",
  
  "job.applyNow": "Apply Now"
};


export default translations;
