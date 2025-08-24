import { Phone, Mail, MapPin, Clock, MessageSquare, Headphones, ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const subject = formData.get('subject') as string;

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message, subject }
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Monday - Friday, 9AM - 6PM EST",
      contact: "+1 (506) 871-1872",
      action: () => window.open('tel:+15068711872')
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "We typically respond within 24 hours",
      contact: "support@propmanagement.com",
      action: () => window.open('mailto:support@propmanagement.com')
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our team",
      contact: "Available 24/7",
      action: () => navigate('/support')
    }
  ];

  const offices = [
    {
      city: "Moncton",
      address: "Bureau principal",
      zipcode: "Moncton, New Brunswick",
      phone: "+1 (506) 871-1872"
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
            <MessageSquare className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground dark:text-foreground mb-6 leading-tight">
            {t('contactUs')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 dark:text-muted-foreground/80">
            {t('contactSubtitle')}
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="group bg-card/50 dark:bg-card/30 backdrop-blur-sm border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={method.action}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-primary/20">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-bold text-card-foreground group-hover:text-foreground transition-colors">
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-2 dark:text-muted-foreground/90">
                      {method.description}
                    </p>
                    <p className="font-semibold text-primary group-hover:text-primary/90 transition-colors">
                      {method.contact}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
        <div className="max-w-4xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 rounded-lg p-6">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('sendMessage')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                      {t('yourName')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                      {t('yourEmail')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="How can we help you?"
                    className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                    {t('message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Tell us about your property management needs..."
                    className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? t('sending') : t('send')}
                </Button>
              </form>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Notre Bureau
              </h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:border-primary/50 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                    <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-foreground transition-colors">{office.city}</h3>
                    <div className="space-y-2 text-muted-foreground dark:text-muted-foreground/90">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="ml-6">{office.zipcode}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <span>{office.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-8 p-6 rounded-lg bg-muted/50 dark:bg-muted/30 backdrop-blur-sm border border-border/50 dark:border-border/30">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-muted-foreground dark:text-muted-foreground/90">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-foreground transition-colors">How quickly do you respond to support requests?</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">We typically respond to all support requests within 2-4 hours during business hours, and within 24 hours on weekends.</p>
              </div>
              <div className="p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-foreground transition-colors">Do you offer phone support?</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">Yes! We offer phone support during business hours for all paid plans, and emergency support 24/7 for Pro plan customers.</p>
              </div>
              <div className="p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-foreground transition-colors">Can I schedule a demo?</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">Absolutely! We offer personalized demos to show you how PropManagement can work for your specific needs.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-foreground transition-colors">Do you provide training?</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">Yes, we provide comprehensive onboarding and training sessions to help you get the most out of PropManagement.</p>
              </div>
              <div className="p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-foreground transition-colors">What if I need custom features?</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">We're always looking to improve our platform. Contact us to discuss your specific needs and potential custom solutions.</p>
              </div>
              <div className="p-6 rounded-lg bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 hover:bg-card/80 dark:hover:bg-card/50 transition-all duration-300 group">
                <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-foreground transition-colors">Is there an API available?</h3>
                <p className="text-muted-foreground dark:text-muted-foreground/90">Yes, we offer API access for Pro plan customers to integrate with other tools and systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}