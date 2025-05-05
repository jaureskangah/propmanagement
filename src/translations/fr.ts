
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
import { frTasks } from './features/maintenance/tasks';
import { frFinances } from './features/finances'; 
import frDocumentGenerator from './features/documents/fr';
import { frForm } from './features/tenant/fr/form';

import { frDashboard as frTenantDashboard } from './features/tenant/fr/dashboard';
import { frProfile } from './features/tenant/fr/profile';
import { frDocuments } from './features/tenant/fr/documents';
import { frMaintenance as frTenantMaintenance } from './features/tenant/fr/maintenance';
import { frCommunications } from './features/tenant/fr/communications';

const translations = {
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
  ...frForm,
  ...frTenantDashboard,
  ...frProfile,
  ...frDocuments,
  ...frTenantMaintenance,
  ...frCommunications,
  ...frFinances,
  documentGenerator: frDocumentGenerator
};

export default translations;
