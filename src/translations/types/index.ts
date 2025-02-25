
// Importer et réexporter toutes les interfaces de traduction
import { AdminDashboardTranslations } from './admin';
import { AuthTranslations } from './auth';
import { ContactTranslations } from './contact';
import { CTATranslations } from './cta';
import { FAQTranslations } from './faq';
import { FeaturesTranslations } from './features';
import { FooterTranslations } from './footer';
import { HeroTranslations } from './hero';
import { HowItWorksTranslations } from './how-it-works';
import { MaintenanceTranslations } from './maintenance';
import { NavigationTranslations } from './navigation';
import { PricingTranslations, PlanFeaturesTranslations } from './pricing';
import { PropertyManagementTranslations } from './property';
import { StatusTranslations } from './status';
import { TenantTranslations } from './tenant';
import { ToastTranslations } from './toasts';

// Exporter tous les types
export { AdminDashboardTranslations as AdminTranslations };
export { AuthTranslations };
export { ContactTranslations };
export { CTATranslations };
export { FAQTranslations };
export { FeaturesTranslations };
export { FooterTranslations };
export { HeroTranslations };
export { HowItWorksTranslations };
export { MaintenanceTranslations };
export { NavigationTranslations };
export { PricingTranslations };
export { PlanFeaturesTranslations };
export { PropertyManagementTranslations as PropertyTranslations };
export { StatusTranslations };
export { TenantTranslations };
export { ToastTranslations };

export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

// Interface principale qui combine toutes les traductions
export interface Translations extends 
  AdminDashboardTranslations,
  AuthTranslations,
  ContactTranslations,
  CTATranslations,
  FAQTranslations,
  FeaturesTranslations,
  FooterTranslations,
  HeroTranslations,
  HowItWorksTranslations,
  MaintenanceTranslations,
  NavigationTranslations,
  PricingTranslations,
  PlanFeaturesTranslations,
  PropertyManagementTranslations,
  StatusTranslations,
  TenantTranslations,
  ToastTranslations {}
