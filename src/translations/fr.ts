import { Translations } from "./types";
import { frToasts } from "./features/toasts";
import { frErrors } from "./features/errors";

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
  ...frFinances, // Use the exported object
  documentGenerator: frDocumentGenerator,
  toasts: frToasts,
  errors: frErrors
};

export default translations;
