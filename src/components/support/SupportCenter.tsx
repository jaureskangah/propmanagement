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
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const supportOptions: SupportOption[] = [
    {
      id: "chat",
      title: "Chat en direct",
      description: "Obtenez une aide immédiate de notre équipe",
      icon: MessageSquare,
      action: () => setActiveSection("chat"),
      available: true
    },
    {
      id: "email",
      title: "Support par email",
      description: "Envoyez-nous un message détaillé",
      icon: Mail,
      action: () => setActiveSection("email"),
      available: true
    },
    {
      id: "phone",
      title: "Support téléphonique",
      description: "Appelez-nous directement",
      icon: PhoneCall,
      action: () => window.open("tel:+15067811872"),
      available: true
    },
    {
      id: "docs",
      title: "Documentation",
      description: "Consultez nos guides et tutoriels",
      icon: Book,
      action: () => setActiveSection("docs"),
      available: true
    }
  ];

  const quickHelp = [
    { title: "Comment créer une propriété", time: "2 min", category: "Démarrage" },
    { title: "Ajouter des locataires", time: "1 min", category: "Gestion" },
    { title: "Gérer les paiements", time: "3 min", category: "Finance" },
    { title: "Planifier la maintenance", time: "2 min", category: "Maintenance" }
  ];

  const systemStatus = [
    { service: "API PropManagement", status: "operational", lastCheck: "Il y a 2 minutes" },
    { service: "Service Email", status: "operational", lastCheck: "Il y a 1 minute" },
    { service: "Base de données", status: "operational", lastCheck: "Il y a 30 secondes" }
  ];

  if (activeSection === "chat") {
    return <SupportChat onBack={() => setActiveSection(null)} />;
  }

  if (activeSection === "email") {
    return <ContactSupport onBack={() => setActiveSection(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centre de Support</h1>
          <p className="text-gray-600">Comment pouvons-nous vous aider aujourd'hui ?</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
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
                className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-red-500"
                onClick={option.action}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {option.available && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Disponible
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-red-600" />
                  <span>Aide rapide</span>
                </CardTitle>
                <CardDescription>
                  Articles les plus consultés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickHelp.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{item.time}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>État du système</span>
                </CardTitle>
                <CardDescription>
                  Tous les services sont opérationnels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemStatus.map((service, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-900">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 mb-1">
                        Opérationnel
                      </Badge>
                      <p className="text-xs text-gray-500">{service.lastCheck}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Information */}
        <motion.div 
          className="mt-8 text-center p-6 bg-white rounded-lg border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Besoin d'aide supplémentaire ?
          </h3>
          <p className="text-gray-600 mb-4">
            Notre équipe est disponible du lundi au vendredi, de 9h à 17h
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