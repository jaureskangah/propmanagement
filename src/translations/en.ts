
import { Translations } from "./types";
import { enToasts } from "./features/toasts";
import { enErrors } from "./features/errors";

// Imports from feature translation files
import { enAuth } from "./features/auth";
import { enAdmin } from "./features/admin";
import { enCommon } from "./features/common";
import { enContact } from "./features/contact";
import { enCTA } from "./features/cta";
import { enFAQ } from "./features/faq";
import { enFeatures } from "./features/features";
import { enFooter } from "./features/footer";
import { enHero } from "./features/hero";
import { enHowItWorks } from "./features/how-it-works";
import { enMaintenance } from "./features/maintenance";
import { enModal } from "./features/modal";
import { enNavigation } from "./features/navigation";
import { enPricing, enPlanFeatures } from "./features/pricing";
import { enProperty } from "./features/property";
import { enSettings } from "./features/settings";
import { enStatus } from "./features/status";
import { enTenant } from "./features/tenant";
import { enDashboard } from "./features/dashboard";
import { enFinances } from "./features/finances";
import { enVendors } from "./features/vendors";

// Import document generator translations
import { enDocumentGenerator } from "./features/documents";

const translations: Translations = {
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
  ...enPlanFeatures, // Plan features translations
  ...enProperty,
  ...enSettings,
  ...enStatus,
  ...enTenant,
  ...enFinances,
  ...enVendors,
  documentGenerator: enDocumentGenerator,
  toasts: enToasts,
  errors: enErrors
};

export default translations;
