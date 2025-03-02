
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

// Import les traductions du tableau de bord locataire
import { enDashboard as enTenantDashboard } from './features/tenant/en/dashboard';

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
  // Ajouter les traductions du tableau de bord locataire
  ...enTenantDashboard
};
