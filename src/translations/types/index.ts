
// Importer et réexporter toutes les interfaces de traduction
import type { AdminDashboardTranslations } from './admin';
import type { AuthTranslations } from './auth';
import type { ContactTranslations } from './contact';
import type { CTATranslations } from './cta';
import type { FAQTranslations } from './faq';
import type { FeaturesTranslations } from './features';
import type { FooterTranslations } from './footer';
import type { HeroTranslations } from './hero';
import type { HowItWorksTranslations } from './how-it-works';
import type { MaintenanceTranslations } from './maintenance';
import type { NavigationTranslations } from './navigation';
import type { PricingTranslations, PlanFeaturesTranslations } from './pricing';
import type { PropertyManagementTranslations } from './property';
import type { StatusTranslations } from './status';
import type { TenantTranslations } from './tenant';
import type { ToastTranslations } from './toasts';

// Exporter tous les types
export type { AdminDashboardTranslations as AdminTranslations };
export type { AuthTranslations };
export type { ContactTranslations };
export type { CTATranslations };
export type { FAQTranslations };
export type { FeaturesTranslations };
export type { FooterTranslations };
export type { HeroTranslations };
export type { HowItWorksTranslations };
export type { MaintenanceTranslations };
export type { NavigationTranslations };
export type { PricingTranslations };
export type { PlanFeaturesTranslations };
export type { PropertyManagementTranslations };
export type { StatusTranslations };
export type { TenantTranslations };
export type { ToastTranslations };

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
