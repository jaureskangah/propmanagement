
import { Translations } from "./types";
import { frToasts } from "./features/toasts";
import { frErrors } from "./features/errors";

// Imports from feature translation files
import { frNavigation } from "./features/navigation";
import { frHero } from "./features/hero";
import { frFeatures } from "./features/features";
import { frPricing, frPlanFeatures } from "./features/pricing";
import { frContact } from "./features/contact";
import { frAuth } from "./features/auth";
import { frCTA } from "./features/cta";
import { frFAQ } from "./features/faq";
import { frAdmin } from "./features/admin";
import { frStatus } from "./features/status";
import { frProperty } from "./features/property";
import { frMaintenance } from "./features/maintenance";
import { frTenant } from "./features/tenant";
import { frHowItWorks } from "./features/how-it-works";
import { frFooter } from "./features/footer";
import { frCommon } from "./features/common";
import { frDashboard } from "./features/dashboard";
import { frSettings } from "./features/settings";
import { frModal } from "./features/modal";
import { frFinances } from "./features/finances";

// Import document generator translations
import { frDocumentGenerator } from "./features/documents";

// Imports manquants qu'il faudrait créer
const frTasks = { /* Ajouter les traductions pour tasks */ };
const frList = { /* Ajouter les traductions pour list */ };
const frTenantDashboard = { /* Ajouter les traductions pour tenant dashboard */ };
const frProfile = { /* Ajouter les traductions pour profile */ };
const frDocuments = { /* Ajouter les traductions pour documents */ };
const frTenantMaintenance = { /* Ajouter les traductions pour tenant maintenance */ };
const frCommunications = { /* Ajouter les traductions pour communications */ };

const translations: Translations = {
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
  ...frTasks,
  ...frList,
  ...frTenantDashboard,
  ...frProfile,
  ...frDocuments,
  ...frTenantMaintenance,
  ...frCommunications,
  ...frFinances,
  documentGenerator: frDocumentGenerator,
  toasts: frToasts,
  errors: frErrors
};

export default translations;
