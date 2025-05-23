
import { PlanFeaturesTranslations } from "@/translations/types";

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  priceId: string;
  popular?: boolean;
  gradient: string;
  borderColor: string;
  iconColor: string;
}

export const getPlans = (t: (key: string) => string): PricingPlan[] => [
  {
    name: t('freemiumPlan'),
    price: "15",
    features: [
      t('upTo2Properties'),
      t('rentManagement'),
      t('digitalDocuments'),
      t('basicPropertyCards'),
      t('emailNotifications'),
    ],
    buttonText: "pricingStartFree",
    priceId: "price_basic",
    gradient: "from-blue-50 via-indigo-50 to-sky-100",
    borderColor: "border-blue-500",
    iconColor: "text-blue-600",
  },
  {
    name: t('proPlan'),
    price: "35",
    popular: true,
    features: [
      t('upTo5Properties'),
      t('tenantVerification'),
      t('financialReports'),
      t('maintenanceManagement'),
      t('advancedDashboard'),
      t('prioritySupport'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_standard",
    gradient: "from-rose-50 via-pink-50 to-orange-100",
    borderColor: "border-[#ea384c]",
    iconColor: "text-[#ea384c]",
  },
  {
    name: t('enterprisePlan'),
    price: "60",
    features: [
      t('upTo20Properties'),
      t('advancedFinancialReports'),
      t('customDashboard'),
      t('dedicatedSupport'),
      t('userTraining'),
      t('dailyBackup'),
    ],
    buttonText: "pricingGetStarted",
    priceId: "price_pro",
    gradient: "from-violet-50 via-purple-50 to-fuchsia-100",
    borderColor: "border-purple-600",
    iconColor: "text-purple-700",
  },
];
