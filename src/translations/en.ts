
import { Translations } from './types';
import { enNavigation } from './features/navigation';
import { enPricing } from './features/pricing';
import { enAuth } from './features/auth';
import { enHero } from './features/hero';
import { enFeatures } from './features/features';
import { enHowItWorks } from './features/how-it-works';
import { enFAQ } from './features/faq';
import { enContact } from './features/contact';
import { enCTA } from './features/cta';
import { enFooter } from './features/footer';
import { enCommon } from './features/common';
import { enModal } from './features/modal';
import { enProperty } from './features/property';
import { enDashboard } from './features/dashboard';
import { enTenant } from './features/tenant';
import { enStatus } from './features/status';
import { enSettings } from './features/settings';
import { enMaintenance } from './features/maintenance';
import { enAdmin } from './features/admin';
import { enFinances } from './features/finances';
import { enDocuments } from './features/documents';

const translations: Translations = {
  navigation: enNavigation,
  pricing: enPricing,
  auth: enAuth,
  hero: enHero,
  features: enFeatures,
  howItWorks: enHowItWorks,
  faq: enFAQ,
  contact: enContact,
  cta: enCTA,
  footer: enFooter,
  common: enCommon,
  modal: enModal,
  property: enProperty,
  dashboard: enDashboard,
  tenant: enTenant,
  status: enStatus,
  settings: enSettings,
  maintenance: enMaintenance,
  admin: enAdmin,
  finances: enFinances,
  documents: enDocuments,
};

export default translations;
