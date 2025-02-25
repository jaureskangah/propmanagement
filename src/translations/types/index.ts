
import { NavigationTranslations } from './navigation';
import { HeroTranslations } from './hero';
import { FeaturesTranslations } from './features';
import { PricingTranslations } from './pricing';
import { ToastTranslations } from './toasts';
import { ContactTranslations } from './contact';
import { AuthTranslations } from './auth';
import { CTATranslations } from './cta';
import { FAQTranslations } from './faq';
import { AdminTranslations } from './admin';
import { StatusTranslations } from './status';
import { PropertyTranslations } from './property';
import { MaintenanceTranslations } from '../types/maintenance';
import { TenantTranslations } from './tenant';
import { HowItWorksTranslations } from './how-it-works';
import { FooterTranslations } from './footer';

export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

export interface Translations extends 
  NavigationTranslations,
  HeroTranslations,
  FeaturesTranslations,
  PricingTranslations,
  ToastTranslations,
  ContactTranslations,
  AuthTranslations,
  CTATranslations,
  FAQTranslations,
  AdminTranslations,
  StatusTranslations,
  PropertyTranslations,
  MaintenanceTranslations,
  TenantTranslations,
  HowItWorksTranslations,
  FooterTranslations {}
