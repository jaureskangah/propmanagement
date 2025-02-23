
export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

export * from './navigation';
export * from './hero';
export * from './features';
export * from './pricing';
export * from './toasts';
export * from './contact';
export * from './auth';
export * from './cta';
export * from './faq';
export * from './admin';
export * from './status';
export * from './property';
export * from './maintenance';

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
