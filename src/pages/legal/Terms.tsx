
import { ArrowLeft, FileText, Shield, Users, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Terms() {
  const navigate = useNavigate();
  const { t } = useLocale();

  const sections = [
    {
      icon: FileText,
      title: "1. Acceptance of Terms",
      content: "By accessing and using PropManagement, you agree to be bound by these Terms of Service. Please read these terms carefully before using our services."
    },
    {
      icon: Shield,
      title: "2. Use License",
      content: "PropManagement grants you a limited, non-exclusive, non-transferable license to use our services for your property management needs, subject to these terms."
    },
    {
      icon: Users,
      title: "3. User Obligations",
      items: [
        "Provide accurate information",
        "Maintain the security of your account", 
        "Comply with applicable laws",
        "Respect the rights of others"
      ]
    },
    {
      icon: Scale,
      title: "4. Limitation of Liability",
      content: "PropManagement shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services."
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
          <FileText className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Please read these terms and conditions carefully before using our service
          </p>
          <p className="text-sm text-muted-foreground/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900/95 dark:border-t dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => {
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
                  <CardContent className="text-center">
                    {section.content && (
                      <p className="text-muted-foreground dark:text-gray-300">
                        {section.content}
                      </p>
                    )}
                    {section.items && (
                      <ul className="list-disc pl-6 text-left text-muted-foreground dark:text-gray-300 space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Additional Terms */}
          <div className="mt-16">
            <Card className="border-border dark:bg-gray-800/50 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground text-center">
                  Additional Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">5. Privacy and Data Protection</h3>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, 
                    which is incorporated into these Terms by reference.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">6. Modifications to Service</h3>
                  <p className="text-muted-foreground dark:text-gray-300">
                    We reserve the right to modify or discontinue our service at any time, with or without notice. 
                    We shall not be liable to you or any third party for any modification or discontinuance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">7. Governing Law</h3>
                  <p className="text-muted-foreground dark:text-gray-300">
                    These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                    in which PropManagement operates.
                  </p>
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
            Questions About Our Terms?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our legal team is here to help you understand our terms of service
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/contact')}
          >
            Contact Legal Team
          </Button>
        </div>
      </section>
    </div>
  );
}
