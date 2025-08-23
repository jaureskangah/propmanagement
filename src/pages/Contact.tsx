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
      contact: "+1 (555) 123-4567",
      action: () => window.open('tel:+15551234567')
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
      city: "New York",
      address: "123 Broadway, Suite 400",
      zipcode: "New York, NY 10001",
      phone: "+1 (212) 555-0123"
    },
    {
      city: "San Francisco",
      address: "456 Market Street, Floor 10",
      zipcode: "San Francisco, CA 94102",
      phone: "+1 (415) 555-0456"
    },
    {
      city: "Austin",
      address: "789 Congress Avenue, Suite 200",
      zipcode: "Austin, TX 78701",
      phone: "+1 (512) 555-0789"
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
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('contactUs')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('contactSubtitle')}
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={method.action}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ea384c] to-[#d31c3f] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-2">
                      {method.description}
                    </p>
                    <p className="font-semibold text-[#ea384c]">
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
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('sendMessage')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('yourName')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('yourEmail')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Tell us about your property management needs..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#ea384c] hover:bg-[#d31c3f]"
                >
                  {isLoading ? t('sending') : t('send')}
                </Button>
              </form>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Offices
              </h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="p-6 rounded-lg border border-slate-200 hover:border-[#ea384c] transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{office.city}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-[#ea384c]" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="ml-6">{office.zipcode}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-[#ea384c]" />
                        <span>{office.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-8 p-6 rounded-lg bg-slate-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#ea384c]" />
                  Business Hours
                </h3>
                <div className="space-y-2 text-gray-600">
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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">How quickly do you respond to support requests?</h3>
                <p className="text-gray-600">We typically respond to all support requests within 2-4 hours during business hours, and within 24 hours on weekends.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Do you offer phone support?</h3>
                <p className="text-gray-600">Yes! We offer phone support during business hours for all paid plans, and emergency support 24/7 for Pro plan customers.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Can I schedule a demo?</h3>
                <p className="text-gray-600">Absolutely! We offer personalized demos to show you how PropManagement can work for your specific needs.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Do you provide training?</h3>
                <p className="text-gray-600">Yes, we provide comprehensive onboarding and training sessions to help you get the most out of PropManagement.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">What if I need custom features?</h3>
                <p className="text-gray-600">We're always looking to improve our platform. Contact us to discuss your specific needs and potential custom solutions.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Is there an API available?</h3>
                <p className="text-gray-600">Yes, we offer API access for Pro plan customers to integrate with other tools and systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}