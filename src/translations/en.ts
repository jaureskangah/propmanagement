
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
import { enTenant } from './features/tenant';
import { enHowItWorks } from './features/how-it-works';
import { enFooter } from './features/footer';

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
  ...enMaintenance,
  ...enTenant,
  ...enHowItWorks,
  ...enFooter,
  // Add missing maintenance translations
  maintenanceRequestTitle: "Maintenance Request",
  maintenanceCalendar: "Maintenance Calendar",
  preventiveMaintenance: "Preventive Maintenance",
  workOrders: "Work Orders",
  costs: "Costs",
  vendors: "Vendors",
  regularTask: "Regular Task",
  inspection: "Inspection",
  seasonalTask: "Seasonal Task",
  taskTitle: "Task Title",
  deadline: "Deadline",
  taskType: "Task Type",
  selectType: "Select Type",
  addNewTask: "Add New Task"
};
