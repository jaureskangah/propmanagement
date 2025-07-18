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
import { useLocale } from "@/components/providers/LocaleProvider";
import { supportTranslations } from "@/translations/features/support";
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
  const { locale } = useLocale();
  const t = supportTranslations[locale as keyof typeof supportTranslations];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const supportOptions: SupportOption[] = [
    {
      id: "chat",
      title: t.supportOptions.chat.title,
      description: t.supportOptions.chat.description,
      icon: MessageSquare,
      action: () => setActiveSection("chat"),
      available: true
    },
    {
      id: "email",
      title: t.supportOptions.email.title,
      description: t.supportOptions.email.description,
      icon: Mail,
      action: () => setActiveSection("email"),
      available: true
    },
    {
      id: "phone",
      title: t.supportOptions.phone.title,
      description: t.supportOptions.phone.description,
      icon: PhoneCall,
      action: () => window.open("tel:+15067811872"),
      available: true
    },
    {
      id: "docs",
      title: t.supportOptions.docs.title,
      description: t.supportOptions.docs.description,
      icon: Book,
      action: () => setActiveSection("docs"),
      available: true
    }
  ];

  const quickHelp = [
    { title: t.quickHelp.articles.createProperty, time: "2 min", category: t.quickHelp.categories.getting_started },
    { title: t.quickHelp.articles.addTenants, time: "1 min", category: t.quickHelp.categories.management },
    { title: t.quickHelp.articles.managePayments, time: "3 min", category: t.quickHelp.categories.finance },
    { title: t.quickHelp.articles.scheduleMaintenance, time: "2 min", category: t.quickHelp.categories.maintenance }
  ];

  const systemStatus = [
    { service: t.systemStatus.services.api, status: "operational", lastCheck: `${t.systemStatus.lastCheck} 2 ${t.timeUnits.minutes}` },
    { service: t.systemStatus.services.email, status: "operational", lastCheck: `${t.systemStatus.lastCheck} 1 ${t.timeUnits.minutes}` },
    { service: t.systemStatus.services.database, status: "operational", lastCheck: `${t.systemStatus.lastCheck} 30 secondes` }
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
              <span>{t.backToDashboard}</span>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
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
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base dark-card-subtle"
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
                className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary dark-card-gradient dark-hover-effect"
                onClick={option.action}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">{option.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {option.available && (
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          {t.badges.available}
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
            <Card className="dark-card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span>{t.quickHelp.title}</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {t.quickHelp.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickHelp.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 dark:bg-gray-800/30 rounded-lg hover:bg-muted dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
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
            <Card className="dark-card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span>{t.systemStatus.title}</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {t.systemStatus.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemStatus.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 dark:bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-foreground">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 mb-1">
                        {t.systemStatus.operational}
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
          className="mt-8 text-center p-6 bg-card rounded-lg border dark-card-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t.contactInfo.title}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t.contactInfo.subtitle}
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