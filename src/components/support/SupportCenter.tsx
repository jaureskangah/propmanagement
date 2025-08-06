import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Mail, 
  HelpCircle, 
  Book, 
  PhoneCall, 
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupportTranslations } from "@/hooks/useSupportTranslations";
import { FeatureGate } from "@/components/subscription/FeatureGate";
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits";
import SupportChat from "./SupportChat";
import ContactSupport from "./ContactSupport";

interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  available: boolean;
}

export default function SupportCenter() {
  const { t, translations } = useSupportTranslations();
  const limits = useSubscriptionLimits();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const supportOptions: SupportOption[] = [
    {
      id: "chat",
      title: translations.chatTitle,
      description: limits.hasPrioritySupport ? translations.chatDescription : "Support basique disponible",
      icon: MessageSquare,
      action: () => setActiveSection("chat"),
      available: true
    },
    {
      id: "email",
      title: translations.emailTitle,
      description: translations.emailDescription,
      icon: Mail,
      action: () => setActiveSection("email"),
      available: true
    },
    {
      id: "phone",
      title: translations.phoneTitle,
      description: translations.phoneDescription,
      icon: PhoneCall,
      action: () => window.open("tel:+15067811872"),
      available: limits.hasDedicatedSupport
    },
    {
      id: "docs",
      title: translations.docsTitle,
      description: translations.docsDescription,
      icon: Book,
      action: () => setActiveSection("docs"),
      available: true
    }
  ];

  const quickHelp = [
    { title: translations.quickHelp.createProperty, time: translations.timeLabels.min2, category: translations.categories.start },
    { title: translations.quickHelp.addTenants, time: translations.timeLabels.min1, category: translations.categories.management },
    { title: translations.quickHelp.managePayments, time: translations.timeLabels.min3, category: translations.categories.finance },
    { title: translations.quickHelp.scheduleMaintenance, time: translations.timeLabels.min2, category: translations.categories.maintenance }
  ];

  const systemStatus = [
    { service: translations.services.api, status: "operational", lastCheck: translations.lastCheckLabels.minutes2 },
    { service: translations.services.email, status: "operational", lastCheck: translations.lastCheckLabels.minute1 },
    { service: translations.services.database, status: "operational", lastCheck: translations.lastCheckLabels.seconds30 }
  ];

  if (activeSection === "chat") {
    return <SupportChat onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === "email") {
    return <ContactSupport onBack={() => setActiveSection(null)} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard'}
              className="flex items-center space-x-2"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span>{translations.backToDashboard}</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{translations.title}</h1>
          <p className="text-muted-foreground">{translations.subtitle}</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder={translations.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base bg-background border-input"
            />
          </div>
        </motion.div>

        {/* Support Options Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {supportOptions.map((option) => {
            const IconComponent = option.icon;
            return (
                <Card 
                key={option.id}
                className={`support-card transition-shadow border-l-4 border-l-primary ${
                  option.available ? 'cursor-pointer hover:shadow-lg' : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={option.available ? option.action : undefined}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="support-option-icon h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                       <div>
                        <CardTitle className="text-lg text-foreground">
                          {option.title}
                          {option.id === 'phone' && !option.available && (
                            <Badge variant="outline" className="ml-2 text-xs">Pro</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {option.available && (
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          {translations.available}
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Help */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="support-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span>{translations.quickHelpTitle}</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {translations.quickHelpDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickHelp.map((item, index) => (
                  <div 
                    key={index}
                    className="support-quick-help-item flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{item.time}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="support-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span>{translations.systemStatusTitle}</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {translations.systemStatusDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemStatus.map((service, index) => (
                  <div 
                    key={index}
                    className="support-system-status-item flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-foreground">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 mb-1">
                        {translations.operational}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{service.lastCheck}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div 
          className="support-contact-info mt-8 text-center p-6 bg-card rounded-lg border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {translations.additionalHelpTitle}
          </h3>
          <p className="text-muted-foreground mb-4">
            {translations.additionalHelpDescription}
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.open("tel:+15067811872")}>
              <PhoneCall className="h-4 w-4 mr-2" />
              +1 (506) 781-1872
            </Button>
            <Button variant="outline" onClick={() => window.open("mailto:contact@propmanagement.app")}>
              <Mail className="h-4 w-4 mr-2" />
              contact@propmanagement.app
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}