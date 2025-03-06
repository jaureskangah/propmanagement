
import { Translations } from './types';
import { frNavigation } from './features/navigation';
import { frHero } from './features/hero';
import { frFeatures } from './features/features';
import { frPricing, frPlanFeatures } from './features/pricing';
import { frToasts } from './features/toasts';
import { frContact } from './features/contact';
import { frAuth } from './features/auth';
import { frCTA } from './features/cta';
import { frFAQ } from './features/faq';
import { frAdmin } from './features/admin';
import { frStatus } from './features/status';
import { frProperty } from './features/property';
import { frMaintenance } from './features/maintenance';
import { frTenant } from './features/tenant';
import { frHowItWorks } from './features/how-it-works';
import { frFooter } from './features/footer';
import { frCommon } from './features/common';
import { frDashboard } from './features/dashboard';
import { frSettings } from './features/settings';
import { frModal } from './features/modal';

// Import les traductions du tableau de bord locataire
import { frDashboard as frTenantDashboard } from './features/tenant/fr/dashboard';
// Import les traductions du profil locataire
import { frProfile } from './features/tenant/fr/profile';
// Import les traductions des documents locataire
import { frDocuments } from './features/tenant/fr/documents';
// Import les traductions de maintenance locataire
import { frMaintenance as frTenantMaintenance } from './features/tenant/fr/maintenance';

export const frTranslations = {
  ...frNavigation,
  ...frHero,
  ...frFeatures,
  ...frPricing,
  ...frPlanFeatures,
  ...frToasts,
  ...frContact,
  ...frAuth,
  ...frCTA,
  ...frFAQ,
  ...frAdmin,
  ...frStatus,
  ...frProperty,
  ...frMaintenance,
  ...frTenant,
  ...frHowItWorks,
  ...frFooter,
  ...frCommon,
  ...frDashboard,
  ...frSettings,
  ...frModal,
  // Ajouter les traductions du tableau de bord locataire
  ...frTenantDashboard,
  // Ajouter les traductions du profil locataire
  ...frProfile,
  // Ajouter les traductions des documents locataire
  ...frDocuments,
  // Ajouter les traductions de maintenance locataire
  ...frTenantMaintenance
};
