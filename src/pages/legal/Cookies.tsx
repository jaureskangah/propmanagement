import { ArrowLeft, Cookie, Settings, Eye, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Cookies() {
  const navigate = useNavigate();
  const { t } = useLocale();

  const cookieTypes = [
    {
      icon: Settings,
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.",
      examples: ["Authentication cookies", "Security tokens", "Session management"]
    },
    {
      icon: Eye,
      title: "Analytics Cookies", 
      description: "We use these cookies to understand how visitors interact with our website, helping us improve our services.",
      examples: ["Google Analytics", "User behavior tracking", "Performance monitoring"]
    },
    {
      icon: Cookie,
      title: "Preference Cookies",
      description: "These cookies remember your preferences and choices to provide a more personalized experience.",
      examples: ["Language settings", "Theme preferences", "Dashboard layout"]
    },
    {
      icon: Target,
      title: "Marketing Cookies",
      description: "These cookies track your online activity to help advertisers deliver more relevant advertisements.",
      examples: ["Ad targeting", "Social media integration", "Conversion tracking"]
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
          <Cookie className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Cookie Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Learn about how we use cookies to improve your experience and protect your privacy
          </p>
          <p className="text-sm text-muted-foreground/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900/95 dark:border-t dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            What Are Cookies?
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300 mb-8">
            Cookies are small text files that are placed on your device when you visit our website. 
            They help us provide you with a better experience and understand how you use our services.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-6 rounded-lg border dark:border-gray-700">
            <p className="text-foreground font-medium">
              We are committed to transparency about our data practices and your privacy rights.
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Types of Cookies We Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cookieTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-primary/10 transition-all duration-300 border-border dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800/70">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground text-center">
                      {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground dark:text-gray-300 mb-4">
                      {type.description}
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Examples:</p>
                      <ul className="text-sm text-muted-foreground/70 dark:text-gray-400 space-y-1">
                        {type.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900/95 dark:border-t dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Managing Your Cookie Preferences
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-foreground font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Browser Settings</h3>
                <p className="text-muted-foreground dark:text-gray-300">
                  You can control and/or delete cookies as you wish. Most browsers allow you to refuse cookies or 
                  delete them after they have been stored on your device.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-foreground font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Opt-Out Options</h3>
                <p className="text-muted-foreground dark:text-gray-300">
                  For analytics and marketing cookies, you can opt out through various industry opt-out mechanisms 
                  or by adjusting your privacy settings.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary-foreground font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Impact of Disabling Cookies</h3>
                <p className="text-muted-foreground dark:text-gray-300">
                  Please note that disabling certain cookies may limit the functionality of our website and 
                  affect your user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Questions About Cookies?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contact our privacy team for more information about our cookie practices
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/contact')}
          >
            Contact Privacy Team
          </Button>
        </div>
      </section>
    </div>
  );
}