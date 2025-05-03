
import { ToastTranslations } from "./toasts";
import { ErrorTranslations } from "./errors";
import { CTATranslations } from "./cta";
import { HeroTranslations } from "./hero";
import { ContactTranslations } from "./contact";
import { HowItWorksTranslations } from "./how-it-works";
import { FeaturesTranslations } from "./features";
import { ModalTranslations } from "./modal";
import { FAQTranslations } from "./faq";
import { FooterTranslations } from "./footer";
import { AdminDashboardTranslations } from "./admin";
import { AuthTranslations } from "./auth";
import { CommonTranslations } from "./common";
import { SharedTranslations } from "./common-translations";
import { DashboardTranslations } from "./dashboard";
import { FinancesTranslations } from "./finances";
import { MaintenanceTranslations } from "./maintenance";
import { NavigationTranslations } from "./navigation";
import { PricingTranslations, PlanFeaturesTranslations } from "./pricing";
import { PropertyManagementTranslations } from "./property";
import { SettingsTranslations } from "./settings";
import { StatusTranslations } from "./status";
import { TenantTranslations } from "./tenant";
import { DocumentGeneratorTranslations } from "./documents";

export type Language = "en" | "fr";
export type UnitSystem = "metric" | "imperial";

export interface Translations {
  [key: string]: any;
  toasts: ToastTranslations;
  errors: ErrorTranslations;
}

// Using export type for all type re-exports
export type { ToastTranslations };
export type { ErrorTranslations };
export type { CTATranslations };
export type { HeroTranslations };
export type { ContactTranslations };
export type { HowItWorksTranslations };
export type { FeaturesTranslations };
export type { ModalTranslations };
export type { FAQTranslations };
export type { FooterTranslations };
export type { AdminDashboardTranslations };
export type { AuthTranslations };
export type { CommonTranslations };
export type { SharedTranslations };
export type { DashboardTranslations };
export type { FinancesTranslations };
export type { MaintenanceTranslations };
export type { NavigationTranslations };
export type { PricingTranslations, PlanFeaturesTranslations };
export type { PropertyManagementTranslations };
export type { SettingsTranslations };
export type { StatusTranslations };
export type { TenantTranslations };
export type { DocumentGeneratorTranslations };
