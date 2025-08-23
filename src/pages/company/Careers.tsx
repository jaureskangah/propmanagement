import { MapPin, Users, Coffee, Zap, ArrowLeft, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Careers() {
  const navigate = useNavigate();
  const { t } = useLocale();

  const jobOffer = {
    title: t("job.title"),
    location: t("job.location"),
    type: t("job.type"),
    availability: t("job.availability"),
  };

  const benefits = [
    {
      icon: Users,
      title: t("job.coFounderOpportunity"),
      description: t("job.equityOwnership")
    },
    {
      icon: Coffee,
      title: t("job.centralRole"), 
      description: t("job.networkAccess")
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
            {t("common.backToHome")}
          </Button>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t("careers.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t("careers.subtitle")}
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              document.getElementById('job-opportunity')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
          >
            {t("careers.viewPositions")}
          </Button>
        </div>
      </section>

      {/* About PropManagement */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900/95 dark:border-t dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            {t("job.aboutPropManagement")}
          </h2>
          <div className="text-center max-w-4xl mx-auto mb-8">
            <p className="text-lg text-muted-foreground dark:text-gray-300 mb-6">
              {t("job.aboutPropManagementDesc")}
            </p>
            <div className="mb-6">
              <p className="text-lg font-semibold text-foreground mb-4">
                {t("job.propManagementFeatures")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-muted-foreground dark:text-gray-300">{t("job.collectRent")}</div>
                <div className="text-muted-foreground dark:text-gray-300">{t("job.trackMaintenance")}</div>
                <div className="text-muted-foreground dark:text-gray-300">{t("job.communicateWithTenants")}</div>
                <div className="text-muted-foreground dark:text-gray-300">{t("job.centralizeDocuments")}</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-lg border dark:border-gray-700">
              <p className="text-foreground font-medium">
                {t("job.accelerateProgram")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {t("careers.whyJoinUs")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/10 transition-all duration-300 text-center border-border dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800/70">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Opportunity */}
      <section id="job-opportunity" className="py-16 px-4 bg-white dark:bg-gray-900/95 dark:border-t dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            {t("careers.opportunityTitle")}
          </h2>
          
          <Card className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-primary/10 transition-shadow border-border dark:bg-gray-800/50 dark:border-gray-700">
            <CardContent className="p-8">
              {/* Job Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  🌟 {jobOffer.title}
                </h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge variant="secondary" className="text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {jobOffer.location}
                  </Badge>
                  <Badge variant="default" className="text-sm">
                    {jobOffer.type}
                  </Badge>
                  <Badge variant="success" className="text-sm">
                    {jobOffer.availability}
                  </Badge>
                </div>
              </div>

              {/* The Role */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-foreground mb-3">
                  🎯 {t("job.theRole")}
                </h4>
                <p className="text-muted-foreground dark:text-gray-300 mb-4">
                  {t("job.roleDescription")}
                </p>
                <ul className="space-y-2 text-muted-foreground dark:text-gray-300">
                  <li>• {t("job.operationsOrg")}</li>
                  <li>• {t("job.growthAcquisition")}</li>
                  <li>• {t("job.userRelations")}</li>
                  <li>• {t("job.fundraisingPartnerships")}</li>
                </ul>
              </div>

              {/* Who You Are */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-foreground mb-3">
                  🔎 {t("job.whoYouAre")}
                </h4>
                <ul className="space-y-2 text-muted-foreground dark:text-gray-300">
                  <li>• {t("job.entrepreneurHeart")}</li>
                  <li>• {t("job.experiencedInterested")}</li>
                  <li>• {t("job.practicalOriented")}</li>
                  <li>• {t("job.motivatedImpact")}</li>
                  <li>• {t("job.comfortableLean")}</li>
                </ul>
              </div>

              {/* What We Offer */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-foreground mb-3">
                  🎁 {t("job.whatWeOffer")}
                </h4>
                <ul className="space-y-2 text-muted-foreground dark:text-gray-300">
                  <li>• {t("job.coFounderOpportunity")}</li>
                  <li>• {t("job.equityOwnership")}</li>
                  <li>• {t("job.centralRole")}</li>
                  <li>• {t("job.networkAccess")}</li>
                </ul>
              </div>

              {/* How to Apply */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-lg border dark:border-gray-700">
                <h4 className="text-xl font-bold text-foreground mb-3">
                  📩 {t("job.howToApply")}
                </h4>
                <p className="text-muted-foreground dark:text-gray-300 mb-4">
                  {t("job.applyDescription")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="default"
                    className="bg-primary hover:bg-primary/90 flex items-center"
                    onClick={() => window.open(`mailto:${t("job.applyEmail")}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {t("job.applyEmail")}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center border-primary text-primary hover:bg-primary hover:text-primary-foreground dark:border-primary dark:text-primary"
                    onClick={() => window.open(t("job.applyLinkedIn"), '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground dark:text-gray-400 mt-4">
                  {t("job.applyInstructions")}
                </p>
                <p className="text-sm font-medium text-foreground mt-2">
                  🔥 {t("job.buildTogether")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}