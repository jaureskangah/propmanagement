import { Shield, Lock, Database, Eye, UserCheck, Globe, ArrowLeft, Key, FileText } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Security() {
  const { t } = useLocale();
  const navigate = useNavigate();

  const securityFeatures = [
    {
      icon: Key,
      title: t('security.securityFeatures.supabaseAuth.title'),
      description: t('security.securityFeatures.supabaseAuth.description'),
      details: t('security.securityFeatures.supabaseAuth.details')
    },
    {
      icon: Shield,
      title: t('security.securityFeatures.rowLevelSecurity.title'),
      description: t('security.securityFeatures.rowLevelSecurity.description'),
      details: t('security.securityFeatures.rowLevelSecurity.details')
    },
    {
      icon: UserCheck,
      title: t('security.securityFeatures.roleBasedAccess.title'),
      description: t('security.securityFeatures.roleBasedAccess.description'),
      details: t('security.securityFeatures.roleBasedAccess.details')
    },
    {
      icon: Database,
      title: t('security.securityFeatures.secureStorage.title'),
      description: t('security.securityFeatures.secureStorage.description'),
      details: t('security.securityFeatures.secureStorage.details')
    },
    {
      icon: Lock,
      title: t('security.securityFeatures.sessionManagement.title'),
      description: t('security.securityFeatures.sessionManagement.description'),
      details: t('security.securityFeatures.sessionManagement.details')
    },
    {
      icon: FileText,
      title: t('security.securityFeatures.documentSecurity.title'),
      description: t('security.securityFeatures.documentSecurity.description'),
      details: t('security.securityFeatures.documentSecurity.details')
    }
  ];

  const certifications = [
    {
      title: t('security.certifications.supabaseSoc2.title'),
      description: t('security.certifications.supabaseSoc2.description')
    },
    {
      title: t('security.certifications.gdprCompliant.title'),
      description: t('security.certifications.gdprCompliant.description')
    },
    {
      title: t('security.certifications.postgresqlSecurity.title'),
      description: t('security.certifications.postgresqlSecurity.description')
    },
    {
      title: t('security.certifications.industryStandards.title'),
      description: t('security.certifications.industryStandards.description')
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
            {t('common.backToHome')}
          </Button>
          <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('security.securityPrivacy')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('security.securityHeroDescription')}
          </p>
          <Button 
            size="lg" 
            className="bg-[#ea384c] hover:bg-[#d31c3f]"
            onClick={() => navigate('/auth')}
          >
            {t('security.startSecureTrial')}
          </Button>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('security.howWeProtectData')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ea384c] to-[#d31c3f] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-700 mb-3">
                      {feature.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {feature.details}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('security.complianceCertifications')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-slate-200 hover:border-[#ea384c] transition-colors">
                <div className="w-12 h-12 bg-[#ea384c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Practices */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('security.dataProtectionPractices')}
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('security.practices.dataMinimization.title')}</h3>
                <p className="text-gray-600">{t('security.practices.dataMinimization.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('security.practices.userControl.title')}</h3>
                <p className="text-gray-600">{t('security.practices.userControl.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('security.practices.dataIsolation.title')}</h3>
                <p className="text-gray-600">{t('security.practices.dataIsolation.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('security.practices.accessControl.title')}</h3>
                <p className="text-gray-600">{t('security.practices.accessControl.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#ea384c] to-[#d31c3f]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('security.questionsAboutSecurity')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('security.securityTeamDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/contact')}
            >
              {t('security.contactSecurityTeam')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#ea384c]"
              onClick={() => navigate('/privacy')}
            >
              {t('security.readPrivacyPolicy')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}