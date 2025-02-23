
import { Translations } from './types';
import { enNavigation } from './features/navigation';
import { enHero } from './features/hero';
import { enFeatures } from './features/features';
import { enPricing } from './features/pricing';
import { enToasts } from './features/toasts';
import { enContact } from './features/contact';
import { enAuth } from './features/auth';
import { enCTA } from './features/cta';
import { enFAQ } from './features/faq';
import { enAdmin } from './features/admin';
import { enStatus } from './features/status';
import { enProperty } from './features/property';
import { enMaintenance } from './features/maintenance';

export const enTranslations: Translations = {
  ...enNavigation,
  ...enHero,
  ...enFeatures,
  ...enPricing,
  ...enToasts,
  ...enContact,
  ...enAuth,
  ...enCTA,
  ...enFAQ,
  ...enAdmin,
  ...enStatus,
  ...enProperty,
  ...enMaintenance
};
