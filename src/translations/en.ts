
import { Translations } from './types';
import { enNavigation } from './features/navigation';
import { enHero } from './features/hero';
import { enFeatures } from './features/features';
import { enPricing, enPlanFeatures } from './features/pricing';
import { enToasts } from './features/toasts';
import { enContact } from './features/contact';
import { enAuth } from './features/auth';
import { enCTA } from './features/cta';
import { enFAQ } from './features/faq';
import { enAdmin } from './features/admin';
import { enStatus } from './features/status';
import { enProperty } from './features/property';
import { enMaintenance } from './features/maintenance';
import { enTenant } from './features/tenant';
import { enHowItWorks } from './features/how-it-works';
import { enFooter } from './features/footer';
import { enCommon } from './features/common';
import { enDashboard } from './features/dashboard';
import { enSettings } from './features/settings';
import { enModal } from './features/modal';

// Import tenant dashboard translations
import { enDashboard as enTenantDashboard } from './features/tenant/en/dashboard';
// Import tenant profile translations
import { enProfile } from './features/tenant/en/profile';
// Import tenant documents translations
import { enDocuments } from './features/tenant/en/documents';
// Import tenant maintenance translations
import { enMaintenance as enTenantMaintenance } from './features/tenant/en/maintenance';

export const enTranslations = {
  ...enNavigation,
  ...enHero,
  ...enFeatures,
  ...enPricing,
  ...enPlanFeatures,
  ...enToasts,
  ...enContact,
  ...enAuth,
  ...enCTA,
  ...enFAQ,
  ...enAdmin,
  ...enStatus,
  ...enProperty,
  ...enMaintenance,
  ...enTenant,
  ...enHowItWorks,
  ...enFooter,
  ...enCommon,
  ...enDashboard,
  ...enSettings,
  ...enModal,
  // Add tenant dashboard translations
  ...enTenantDashboard,
  // Add tenant profile translations
  ...enProfile,
  // Add tenant documents translations
  ...enDocuments,
  // Add tenant maintenance translations
  ...enTenantMaintenance
};
