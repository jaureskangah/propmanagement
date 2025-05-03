
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

export {
  ToastTranslations,
  ErrorTranslations,
  CTATranslations,
  HeroTranslations,
  ContactTranslations,
  HowItWorksTranslations,
  FeaturesTranslations,
  ModalTranslations,
  FAQTranslations,
  FooterTranslations,
  AdminDashboardTranslations,
  AuthTranslations,
  CommonTranslations,
  SharedTranslations,
  DashboardTranslations,
  FinancesTranslations,
  MaintenanceTranslations,
  NavigationTranslations,
  PricingTranslations,
  PlanFeaturesTranslations,
  PropertyManagementTranslations,
  SettingsTranslations,
  StatusTranslations,
  TenantTranslations,
  DocumentGeneratorTranslations
};
