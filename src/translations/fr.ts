
import { Translations } from './types';
import { frNavigation } from './features/navigation';
import { frPricing } from './features/pricing';
import { frAuth } from './features/auth';
import { frHero } from './features/hero';
import { frFeatures } from './features/features';
import { frHowItWorks } from './features/how-it-works';
import { frFAQ } from './features/faq';
import { frContact } from './features/contact';
import { frCTA } from './features/cta';
import { frFooter } from './features/footer';
import { frCommon } from './features/common';
import { frModal } from './features/modal';
import { frProperty } from './features/property';
import { frDashboard } from './features/dashboard';
import { frTenant } from './features/tenant';
import { frStatus } from './features/status';
import { frSettings } from './features/settings';
import { frMaintenance } from './features/maintenance';
import { frAdmin } from './features/admin';
import { frFinances } from './features/finances';
import { frDocuments } from './features/documents';

const translations: Translations = {
  navigation: frNavigation,
  pricing: frPricing,
  auth: frAuth,
  hero: frHero,
  features: frFeatures,
  howItWorks: frHowItWorks,
  faq: frFAQ,
  contact: frContact,
  cta: frCTA,
  footer: frFooter,
  common: frCommon,
  modal: frModal,
  property: frProperty,
  dashboard: frDashboard,
  tenant: frTenant,
  status: frStatus,
  settings: frSettings,
  maintenance: frMaintenance,
  admin: frAdmin,
  finances: frFinances,
  documents: frDocuments,
};

export default translations;
