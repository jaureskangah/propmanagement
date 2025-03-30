
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
import type { CommonTranslations } from './common';
import type { DashboardTranslations } from './dashboard';
import type { SettingsTranslations } from './settings';
import type { ModalTranslations } from './modal';
import type { FinancesTranslations } from './finances';
import type { SharedTranslations } from './common-translations';

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
export type { CommonTranslations };
export type { DashboardTranslations };
export type { SettingsTranslations };
export type { ModalTranslations };
export type { FinancesTranslations };
export type { SharedTranslations };

export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

// Extend translations using a type intersection to avoid property conflicts
export interface Translations extends 
  Omit<AdminDashboardTranslations, keyof SharedTranslations>,
  Omit<AuthTranslations, keyof SharedTranslations>,
  Omit<ContactTranslations, keyof SharedTranslations>,
  Omit<CTATranslations, keyof SharedTranslations>,
  Omit<FAQTranslations, keyof SharedTranslations>,
  Omit<FeaturesTranslations, keyof SharedTranslations>,
  Omit<FooterTranslations, keyof SharedTranslations>,
  Omit<HeroTranslations, keyof SharedTranslations>,
  Omit<HowItWorksTranslations, keyof SharedTranslations>,
  Omit<MaintenanceTranslations, keyof SharedTranslations>,
  Omit<NavigationTranslations, keyof SharedTranslations>,
  Omit<PricingTranslations, keyof SharedTranslations>,
  Omit<PlanFeaturesTranslations, keyof SharedTranslations>,
  Omit<PropertyManagementTranslations, keyof SharedTranslations>,
  Omit<StatusTranslations, keyof SharedTranslations>,
  Omit<TenantTranslations, keyof SharedTranslations>,
  Omit<ToastTranslations, keyof SharedTranslations>,
  Omit<CommonTranslations, keyof SharedTranslations>,
  Omit<DashboardTranslations, keyof SharedTranslations>,
  Omit<SettingsTranslations, keyof SharedTranslations>,
  Omit<ModalTranslations, keyof SharedTranslations>,
  Omit<FinancesTranslations, keyof SharedTranslations>,
  SharedTranslations {}
