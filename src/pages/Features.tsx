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
      details: "Complete tenant lifecycle management with automated workflows"
    },
    {
      icon: Calculator,
      titleKey: "financialTracking",
      descriptionKey: "financialTrackingDesc",
      details: "Track rent, expenses, and generate financial reports automatically"
    },
    {
      icon: Wrench,
      titleKey: "maintenanceScheduling",
      descriptionKey: "maintenanceSchedulingDesc",
      details: "Streamline maintenance requests with vendor management"
    },
    {
      icon: FileText,
      titleKey: "documentGeneration",
      descriptionKey: "documentGenerationDesc",
      details: "Generate leases, notices, and reports with one click"
    },
    {
      icon: BarChart3,
      titleKey: "reportingAnalytics",
      descriptionKey: "reportingAnalyticsDesc",
      details: "Comprehensive analytics and insights for better decisions"
    },
    {
      icon: Shield,
      titleKey: "secureAccess",
      descriptionKey: "secureAccessDesc",
      details: "Bank-grade security with role-based access control"
    },
    {
      icon: Clock,
      title: "Automated Reminders",
      description: "Never miss rent collection or important dates",
      details: "Smart notifications for rent, lease renewals, and maintenance"
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with instant alerts",
      details: "Push notifications for maintenance requests and payments"
    },
    {
      icon: Database,
      title: "Data Export & Import",
      description: "Full control over your property data",
      details: "Export reports and import existing property information"
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
            Retour à l'accueil
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
            Start Free Trial
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
                    {feature.titleKey ? t(feature.titleKey) : feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-lg">
                    {feature.descriptionKey ? t(feature.descriptionKey) : feature.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {feature.details}
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
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of property managers who trust PropManagement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#ea384c]"
              onClick={() => navigate('/contact')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}