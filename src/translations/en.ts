
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
  documentGenerator: enDocumentGenerator,
  // Add generic keys for error messages
  error: 'Error',
  success: 'Success',
  tenantAdded: 'Tenant added successfully',
  errorLoadingTenantData: 'Error loading tenant data',
  invalidEmail: 'Invalid email address',
  invalidAmount: 'Invalid amount'
};

export default translations;
