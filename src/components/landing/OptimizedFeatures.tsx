
import { Shield, Users, FileText, Calculator, Wrench, BarChart3 } from "lucide-react";
import { useLocale } from "../providers/LocaleProvider";

export default function OptimizedFeatures() {
  const { t } = useLocale();

  const features = [
    {
      icon: Users,
      titleKey: "tenantManagement",
      descriptionKey: "tenantManagementDesc",
    },
    {
      icon: Calculator,
      titleKey: "financialTracking",
      descriptionKey: "financialTrackingDesc",
    },
    {
      icon: Wrench,
      titleKey: "maintenanceScheduling",
      descriptionKey: "maintenanceSchedulingDesc",
    },
    {
      icon: FileText,
      titleKey: "documentGeneration",
      descriptionKey: "documentGenerationDesc",
    },
    {
      icon: BarChart3,
      titleKey: "reportingAnalytics",
      descriptionKey: "reportingAnalyticsDesc",
    },
    {
      icon: Shield,
      titleKey: "secureAccess",
      descriptionKey: "secureAccessDesc",
    },
  ];

  return (
    <section id="everything-you-need" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('everythingYouNeed')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('featuresSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#ea384c] to-[#d31c3f] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
