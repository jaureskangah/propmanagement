
export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

import type { NavigationTranslations } from './navigation';
import type { HeroTranslations } from './hero';
import type { FeaturesTranslations } from './features';
import type { PricingTranslations, PlanFeaturesTranslations } from './pricing';
import type { ToastTranslations } from './toasts';
import type { ContactTranslations } from './contact';
import type { AuthTranslations } from './auth';
import type { CTATranslations } from './cta';
import type { FAQTranslations } from './faq';
import type { AdminDashboardTranslations } from './admin';
import type { StatusTranslations } from './status';
import type { PropertyManagementTranslations } from './property';
import type { MaintenanceTranslations } from './maintenance';

export {
  NavigationTranslations,
  HeroTranslations,
  FeaturesTranslations,
  PricingTranslations,
  PlanFeaturesTranslations,
  ToastTranslations,
  ContactTranslations,
  AuthTranslations,
  CTATranslations,
  FAQTranslations,
  AdminDashboardTranslations,
  MaintenanceTranslations,
  StatusTranslations,
  PropertyManagementTranslations
};

export interface Translations extends 
  NavigationTranslations,
  HeroTranslations,
  FeaturesTranslations,
  PricingTranslations,
  PlanFeaturesTranslations,
  ToastTranslations,
  ContactTranslations,
  AuthTranslations,
  CTATranslations,
  FAQTranslations,
  AdminDashboardTranslations,
  MaintenanceTranslations,
  StatusTranslations,
  PropertyManagementTranslations {}
