
import { Translations } from './types';
import { frNavigation } from './features/navigation';
import { frHero } from './features/hero';
import { frFeatures } from './features/features';
import { frPricing } from './features/pricing';
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

export const frTranslations: Translations = {
  ...frNavigation,
  ...frHero,
  ...frFeatures,
  ...frPricing,
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
  // Add missing maintenance translations
  maintenanceRequestTitle: "Demande de Maintenance",
  maintenanceCalendar: "Calendrier de Maintenance",
  preventiveMaintenance: "Maintenance Préventive",
  workOrders: "Ordres de Travail",
  costs: "Coûts",
  vendors: "Fournisseurs",
  regularTask: "Tâche Régulière",
  inspection: "Inspection",
  seasonalTask: "Tâche Saisonnière",
  taskTitle: "Titre de la Tâche",
  deadline: "Date Limite",
  taskType: "Type de Tâche",
  selectType: "Sélectionner le Type",
  addNewTask: "Ajouter une Nouvelle Tâche"
};
