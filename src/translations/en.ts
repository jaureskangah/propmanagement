import { Translations } from "./types";
import { enToasts } from "./features/toasts";
import { enErrors } from "./features/errors";

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
  ...enProperty,
  ...enSettings,
  ...enStatus,
  ...enTenant,
  ...enToasts,
  ...enFinances, // Use the exported object
  ...enVendors,
  documentGenerator: enDocumentGenerator,
  toasts: enToasts,
  errors: enErrors
};

export default translations;
