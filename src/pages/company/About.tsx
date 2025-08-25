
import { ArrowLeft, Users, Target, Heart } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const { t } = useLocale();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
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
          <Users className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-card/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Target className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {t('about.mission.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('about.mission.description')}
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {t('about.values.title')}
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4 p-6 glass-card rounded-2xl border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('about.values.innovation.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('about.values.innovation.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 glass-card rounded-2xl border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('about.values.integrity.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('about.values.integrity.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 glass-card rounded-2xl border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t('about.values.customerFocus.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('about.values.customerFocus.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rejoignez-nous dans notre mission
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Découvrez comment PropManagement peut transformer votre gestion immobilière
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
            >
              Commencer gratuitement
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => navigate('/contact')}
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
