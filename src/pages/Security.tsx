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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
        <div className="max-w-6xl mx-auto text-center relative">
          <div className="flex justify-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/50 dark:hover:bg-muted/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.backToHome')}
            </Button>
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-6 shadow-lg dark:shadow-primary/20">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground dark:text-foreground mb-6 leading-tight">
            {t('security.securityPrivacy')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 dark:text-muted-foreground/80">
            {t('security.securityHeroDescription')}
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/auth')}
          >
            {t('security.startSecureTrial')}
          </Button>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t('security.howWeProtectData')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group bg-card/50 dark:bg-card/30 backdrop-blur-sm border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-primary/20">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-foreground transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-3 dark:text-muted-foreground/90">
                      {feature.description}
                    </p>
                    <p className="text-sm text-muted-foreground/70 dark:text-muted-foreground/60">
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
      <section className="py-16 px-4 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t('security.complianceCertifications')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:border-primary/50 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-primary/20">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-card-foreground mb-2 group-hover:text-foreground transition-colors">{cert.title}</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Practices */}
      <section className="py-16 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t('security.dataProtectionPractices')}
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg dark:shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-foreground transition-colors">{t('security.practices.dataMinimization.title')}</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">{t('security.practices.dataMinimization.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg dark:shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-bold text-sm">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-foreground transition-colors">{t('security.practices.userControl.title')}</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">{t('security.practices.userControl.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg dark:shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-bold text-sm">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-foreground transition-colors">{t('security.practices.dataIsolation.title')}</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">{t('security.practices.dataIsolation.description')}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg dark:shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-bold text-sm">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-foreground transition-colors">{t('security.practices.accessControl.title')}</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">{t('security.practices.accessControl.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90" />
        <div className="max-w-4xl mx-auto text-center text-primary-foreground relative">
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
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
              onClick={() => navigate('/contact')}
            >
              {t('security.contactSecurityTeam')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground shadow-lg backdrop-blur-sm"
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