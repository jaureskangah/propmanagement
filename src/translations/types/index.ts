
export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

import { AdminDashboardTranslations } from './admin';
import { MaintenanceTranslations } from './maintenance';
import { TenantTranslations } from './tenant';
import { PropertyManagementTranslations } from './property';
import type { NavigationTranslations } from './navigation';
import type { HeroTranslations } from './hero';
import type { FeaturesTranslations } from './features';
import type { PricingTranslations, PlanFeaturesTranslations } from './pricing';
import type { ToastTranslations } from './toasts';
import type { ContactTranslations } from './contact';
import type { AuthTranslations } from './auth';
import type { CTATranslations } from './cta';
import type { FAQTranslations } from './faq';
import type { StatusTranslations } from './status';
import type { HowItWorksTranslations } from './how-it-works';
import type { FooterTranslations } from './footer';

export interface Translations 
  extends NavigationTranslations,
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
    PropertyManagementTranslations,
    TenantTranslations,
    HowItWorksTranslations,
    FooterTranslations {}

export type {
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
  PropertyManagementTranslations,
  TenantTranslations,
  HowItWorksTranslations,
  FooterTranslations
};
