import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Globe, 
  Database, 
  Shield,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const ProductionConfigTools = () => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const handleDomainSetup = () => {
    toast({
      title: "Configuration de Domaine",
      description: "Consultez la documentation Lovable pour configurer votre domaine personnalisé",
    });
  };

  const handleBackupCheck = async () => {
    setIsChecking(true);
    try {
      // Simulate backup check
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Vérification des Sauvegardes",
        description: "Vérifiez les paramètres de sauvegarde dans votre tableau de bord Supabase",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSecretsCheck = () => {
    const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasAnonKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const status = hasSupabaseUrl && hasAnonKey ? 'success' : 'error';
    
    toast({
      title: "Vérification des Secrets",
      description: status === 'success' ? 
        "Variables d'environnement configurées correctement" :
        "Certaines variables d'environnement sont manquantes",
      variant: status === 'error' ? 'destructive' : 'default'
    });
  };

  const configItems = [
    {
      title: "Domaine Personnalisé",
      description: "Configurer un domaine personnalisé pour votre application",
      icon: <Globe className="h-5 w-5" />,
      action: handleDomainSetup,
      status: "pending" as const,
      actionText: "Configurer"
    },
    {
      title: "Variables d'Environnement",
      description: "Vérifier que tous les secrets sont configurés",
      icon: <Shield className="h-5 w-5" />,
      action: handleSecretsCheck,
      status: "ready" as const,
      actionText: "Vérifier"
    },
    {
      title: "Sauvegardes Automatiques",
      description: "Configurer les sauvegardes automatiques de la base de données",
      icon: <Database className="h-5 w-5" />,
      action: handleBackupCheck,
      status: "ready" as const,
      actionText: "Vérifier",
      loading: isChecking
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default" className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">À configurer</Badge>;
      default:
        return <Badge variant="outline">Non configuré</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Outils de Configuration Production
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {configItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                {item.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.title}</h4>
                    {getStatusIcon(item.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(item.status)}
                <Button
                  onClick={item.action}
                  disabled={item.loading}
                  size="sm"
                  variant="outline"
                >
                  {item.loading ? "Vérification..." : item.actionText}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liens Utiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Tableau de Bord Supabase</h4>
              <p className="text-sm text-muted-foreground">
                Gérer la base de données et les sauvegardes
              </p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir
              </a>
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Configuration Domaine Lovable</h4>
              <p className="text-sm text-muted-foreground">
                Documentation pour configurer un domaine personnalisé
              </p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <a href="https://docs.lovable.dev" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation
              </a>
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Linter de Sécurité Supabase</h4>
              <p className="text-sm text-muted-foreground">
                Vérifier la sécurité de votre base de données
              </p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Linter de Sécurité",
                  description: "Utilisez 'supabase db lint' dans votre terminal pour vérifier la sécurité",
                });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};