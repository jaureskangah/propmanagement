import { Shield, Users, FileText, Calculator, Wrench, BarChart3, Clock, Bell, Database, Lock, ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const { t } = useLocale();
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      titleKey: "tenantManagement",
      descriptionKey: "tenantManagementDesc",
      detailsKey: "tenantManagementDetails"
    },
    {
      icon: Calculator,
      titleKey: "financialTracking",
      descriptionKey: "financialTrackingDesc",
      detailsKey: "financialTrackingDetails"
    },
    {
      icon: Wrench,
      titleKey: "maintenanceScheduling",
      descriptionKey: "maintenanceSchedulingDesc",
      detailsKey: "maintenanceSchedulingDetails"
    },
    {
      icon: FileText,
      titleKey: "documentGeneration",
      descriptionKey: "documentGenerationDesc",
      detailsKey: "documentGenerationDetails"
    },
    {
      icon: BarChart3,
      titleKey: "reportingAnalytics",
      descriptionKey: "reportingAnalyticsDesc",
      detailsKey: "reportingAnalyticsDetails"
    },
    {
      icon: Shield,
      titleKey: "secureAccess",
      descriptionKey: "secureAccessDesc",
      detailsKey: "secureAccessDetails"
    },
    {
      icon: Clock,
      titleKey: "automatedReminders",
      descriptionKey: "automatedRemindersDesc",
      detailsKey: "automatedRemindersDetails"
    },
    {
      icon: Bell,
      titleKey: "realTimeNotifications",
      descriptionKey: "realTimeNotificationsDesc",
      detailsKey: "realTimeNotificationsDetails"
    },
    {
      icon: Database,
      titleKey: "dataExportImport",
      descriptionKey: "dataExportImportDesc",
      detailsKey: "dataExportImportDetails"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-8 text-gray-600 hover:text-[#ea384c] hover:border-[#ea384c]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Button>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('everythingYouNeed')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('featuresSubtitle')}
          </p>
          <Button 
            size="lg" 
            className="bg-[#ea384c] hover:bg-[#d31c3f]"
            onClick={() => navigate('/auth')}
          >
            {t('startFreeTrial')}
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50 transition-all duration-300 border border-slate-200 hover:border-slate-300 hover:shadow-xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ea384c] to-[#d31c3f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 mb-3 text-lg">
                    {t(feature.descriptionKey)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t(feature.detailsKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#ea384c] to-[#d31c3f]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('readyToTransform')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('joinThousands')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
            >
              {t('startFreeTrial')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#ea384c]"
              onClick={() => navigate('/contact')}
            >
              {t('contactSales')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}