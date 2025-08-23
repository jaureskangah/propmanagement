import { ArrowLeft, Shield, Lock, Eye, Users, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { t } = useLocale();

  const privacySections = [
    {
      icon: FileText,
      title: "Information We Collect",
      items: [
        "Account information (name, email, password)",
        "Property data (addresses, descriptions, photos)",
        "Tenant information (contact details, documents)",
        "Financial data (rent, charges, payments)",
        "Usage data and device information"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Information",
      items: [
        "Provide and improve our services",
        "Manage your account and properties",
        "Facilitate landlord-tenant communication",
        "Process payments and transactions",
        "Send important notifications",
        "Ensure platform security"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      items: [
        "With your explicit consent",
        "Service providers (payment, hosting, support)",
        "Legal compliance requirements",
        "Security and fraud prevention",
        "We never sell your personal information"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      items: [
        "End-to-end encryption",
        "Secure authentication",
        "Regular security audits",
        "Restricted data access",
        "Continuous monitoring",
        "Regular backups"
      ]
    },
    {
      icon: Shield,
      title: "Your Rights (GDPR)",
      items: [
        "Access your personal data",
        "Correct inaccurate information",
        "Request data deletion",
        "Data portability",
        "Object to processing",
        "Restrict processing"
      ]
    },
    {
      icon: Globe,
      title: "International Transfers",
      items: [
        "GDPR-compliant transfers",
        "Adequate protection measures",
        "Standard contractual clauses",
        "Data processing agreements",
        "Regular compliance reviews"
      ]
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
            Retour à l'accueil
          </Button>
          <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Nous accordons une grande importance à la protection de votre vie privée et de vos données personnelles
          </p>
          <p className="text-sm text-muted-foreground/70">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900/95 dark:border-t dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Notre Engagement Envers Votre Vie Privée
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300 mb-8">
            Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons 
            vos informations personnelles lorsque vous utilisez notre plateforme de gestion immobilière.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-lg border dark:border-gray-700">
            <p className="text-foreground font-medium">
              Nous respectons le RGPD et nous nous engageons à protéger vos données avec les plus hauts standards de sécurité.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privacySections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/10 transition-all duration-300 border-border dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800/70">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground text-center">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-300">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Retention & Contact */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900/95 dark:border-t dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Data Retention */}
            <Card className="border-border dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground text-center flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  Conservation des Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground dark:text-gray-300">
                  Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services 
                  et respecter nos obligations légales.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Données de compte :</span>
                    <span className="text-sm text-muted-foreground">Tant que votre compte est actif</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Données financières :</span>
                    <span className="text-sm text-muted-foreground">7 ans (obligation légale)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Logs de sécurité :</span>
                    <span className="text-sm text-muted-foreground">1 an</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-border dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground text-center flex items-center justify-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  Nous Contacter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground dark:text-gray-300">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <strong className="text-foreground mr-2">E-mail :</strong>
                    <span className="text-primary">privacy@propmanagement.app</span>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-foreground mr-2">DPO :</strong>
                    <span className="text-primary">dpo@propmanagement.app</span>
                  </div>
                  <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg">
                    <p className="text-sm text-foreground font-medium">
                      Nous nous engageons à répondre à vos demandes dans un délai de 30 jours maximum.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Des Questions sur Vos Données ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Notre équipe de protection des données est là pour vous aider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/contact')}
            >
              Contacter l'Équipe Vie Privée
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => navigate('/legal/cookies')}
            >
              Politique des Cookies
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}