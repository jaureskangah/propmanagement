
import { Translations } from './types';
import { frAdmin } from './features/admin';
import { frAuth } from './features/auth';
import { frCommon } from './features/common';
import { frContact } from './features/contact';
import { frCTA } from './features/cta';
import { frDashboard } from './features/dashboard';
import { frFAQ } from './features/faq';
import { frFeatures } from './features/features';
import { frFooter } from './features/footer';
import { frHero } from './features/hero';
import { frHowItWorks } from './features/how-it-works';
import { frMaintenance } from './features/maintenance';
import { frModal } from './features/modal';
import { frNavigation } from './features/navigation';
import { frPricing } from './features/pricing';
import { frProperty } from './features/property';
import { frSettings } from './features/settings';
import { frStatus } from './features/status';
import { frTenant } from './features/tenant';
import { frToasts } from './features/toasts';
import { frFinances } from './features/finances';
import { frVendors } from './features/maintenance/vendors';
import frDocumentGenerator from './features/documents/fr';

// Créer un objet de traduction unique qui résout les conflits
const translations: any = {
  ...frAdmin,
  ...frAuth,
  ...frCommon,
  ...frContact,
  ...frCTA,
  ...frDashboard,
  ...frFAQ,
  ...frFeatures,
  ...frFooter,
  ...frHero,
  ...frHowItWorks,
  ...frMaintenance,
  ...frModal,
  ...frNavigation,
  ...frPricing,
  ...frProperty,
  ...frSettings,
  ...frStatus,
  ...frTenant,
  ...frToasts,
  ...frFinances,
  ...frVendors,
  documentGenerator: frDocumentGenerator,
  // Ajout de clés génériques pour les messages d'erreur
  error: 'Erreur',
  success: 'Succès',
  tenantAdded: 'Locataire ajouté avec succès',
  errorLoadingTenantData: 'Erreur lors du chargement des données du locataire',
  invalidEmail: 'Adresse email invalide',
  invalidAmount: 'Montant invalide'
};

export default translations;
