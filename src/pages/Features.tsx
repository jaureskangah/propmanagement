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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-8 text-muted-foreground hover:text-primary hover:border-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Button>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('everythingYouNeed')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('featuresSubtitle')}
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
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
                  className="group p-8 rounded-2xl bg-white dark:bg-slate-800/50 hover:bg-gradient-to-br hover:from-white hover:to-slate-50 dark:hover:from-slate-800/70 dark:hover:to-slate-700/50 transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/10"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-300 mb-3 text-lg">
                    {t(feature.descriptionKey)}
                  </p>
                  <p className="text-sm text-muted-foreground/70 dark:text-gray-400">
                    {t(feature.detailsKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
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
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
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