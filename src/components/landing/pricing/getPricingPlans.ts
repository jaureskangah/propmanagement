
import { PlanFeaturesTranslations } from "@/translations/types";

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  priceId: string | null;
  popular?: boolean;
  gradient: string;
  borderColor: string;
  iconColor: string;
}

export const getPlans = (t: (key: string) => string): PricingPlan[] => [
  {
    name: t('freePlan'),
    price: "0",
    features: [
      t('upTo1Property'),
      t('upTo1Tenant'),
      t('basicRentManagement'),
      t('maintenanceManagement'),
      t('basicSupport'),
    ],
    buttonText: "pricingStartFree",
    priceId: null,
    gradient: "from-blue-50 via-indigo-50 to-sky-100",
    borderColor: "border-blue-500",
    iconColor: "text-blue-600",
  },
  {
    name: t('standardPlan'),
    price: "9.99",
    popular: true,
    features: [
      t('upTo10Properties'),
      t('unlimitedTenants'),
      t('fullTenantManagement'),
      t('unlimitedDocumentGeneration'),
      t('maintenanceManagement'),
      t('automatedReminders'),
      t('financialReports'),
      t('dataExportImport'),
      t('prioritySupport'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_1RpmiqBQGq0kS1iiOLKab9L6",
    gradient: "from-rose-50 via-pink-50 to-orange-100",
    borderColor: "border-[#ea384c]",
    iconColor: "text-[#ea384c]",
  },
  {
    name: t('proPlan'),
    price: "29.99",
    features: [
      t('allStandardFeatures'),
      t('unlimitedProperties'),
      t('advancedFinancialReports'),
      t('dedicatedSupport'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_1RpmhGBQGq0kS1iieBEcFUE9",
    gradient: "from-violet-50 via-purple-50 to-fuchsia-100",
    borderColor: "border-purple-600",
    iconColor: "text-purple-700",
  },
];
