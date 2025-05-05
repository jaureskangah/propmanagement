
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
import type { DocumentGeneratorTranslations } from './documents';
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
export type { DocumentGeneratorTranslations };
export type { SharedTranslations };

export type Language = 'en' | 'fr';
export type UnitSystem = 'metric' | 'imperial';

// Liste des propriétés en conflit qui doivent être traitées spécialement
type ConflictKeys = 'active' | 'notAvailable' | 'success' | 'error' | 'cancel';

// Utiliser un type d'intersection pour éviter les conflits de propriétés
export type Translations = 
  & Omit<AdminDashboardTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<AuthTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<ContactTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<CTATranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<FAQTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<FeaturesTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<FooterTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<HeroTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<HowItWorksTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<MaintenanceTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<NavigationTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<PricingTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<PlanFeaturesTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<PropertyManagementTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<StatusTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<TenantTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<ToastTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<CommonTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<DashboardTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<SettingsTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<ModalTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<FinancesTranslations, keyof SharedTranslations | ConflictKeys>
  & Omit<DocumentGeneratorTranslations, keyof SharedTranslations | ConflictKeys>
  & SharedTranslations
  // Réintroduire les propriétés en conflit avec des types string
  & {
    active: string;
    notAvailable: string;
    success: string;
    error: string;
    cancel: string;
  };
