import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Download, 
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  FileText,
  Video,
  MessageSquare
} from 'lucide-react';

interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'api' | 'faq';
  url?: string;
  content?: string;
  status: 'draft' | 'published' | 'updated';
}

interface RollbackPlan {
  id: string;
  name: string;
  description: string;
  steps: string[];
  estimatedTime: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastTested?: Date;
}

export const UserDocumentationCenter = () => {
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string>('overview');

  const documentationSections: DocumentationSection[] = [
    {
      id: 'overview',
      title: 'Guide de Démarrage Rapide',
      description: 'Introduction et premiers pas avec l\'application',
      type: 'guide',
      content: `
# Guide de Démarrage Rapide

## Bienvenue dans votre Application de Gestion Immobilière

Cette application vous permet de gérer efficacement vos propriétés, locataires et opérations immobilières.

### Premiers Pas

1. **Connexion** : Connectez-vous avec votre compte créé lors de l'inscription
2. **Dashboard** : Accédez au tableau de bord principal pour une vue d'ensemble
3. **Propriétés** : Ajoutez vos premières propriétés via le menu "Propriétés"
4. **Locataires** : Invitez vos locataires via le système d'invitation intégré

### Fonctionnalités Principales

- 📊 **Tableau de Bord** : Vue d'ensemble de vos métriques
- 🏠 **Gestion des Propriétés** : Ajout, modification, suivi des propriétés
- 👥 **Gestion des Locataires** : Invitations, profils, communications
- 💰 **Suivi des Paiements** : Loyers, charges, états des lieux
- 🔧 **Maintenance** : Demandes, suivi, prestataires
- 📄 **Documents** : Génération et partage sécurisé
      `,
      status: 'published'
    },
    {
      id: 'properties',
      title: 'Gestion des Propriétés',
      description: 'Comment ajouter et gérer vos propriétés',
      type: 'guide',
      content: `
# Gestion des Propriétés

## Ajouter une Nouvelle Propriété

1. Cliquez sur "Propriétés" dans le menu principal
2. Sélectionnez "Ajouter une propriété"
3. Remplissez les informations obligatoires :
   - Nom de la propriété
   - Adresse complète
   - Type de bien (appartement, maison, etc.)
   - Prix de location

## Modifier une Propriété

- Accédez à la liste des propriétés
- Cliquez sur l'icône d'édition
- Modifiez les informations nécessaires
- Sauvegardez les changements

## Supprimer une Propriété

⚠️ **Attention** : La suppression est irréversible
- Assurez-vous qu'aucun locataire n'est associé
- Archivez d'abord si nécessaire
      `,
      status: 'published'
    },
    {
      id: 'tenants',
      title: 'Gestion des Locataires',
      description: 'Inviter et gérer vos locataires',
      type: 'guide',
      content: `
# Gestion des Locataires

## Inviter un Nouveau Locataire

1. Accédez à "Locataires" → "Inviter un locataire"
2. Remplissez les informations :
   - Nom et prénom
   - Email (obligatoire)
   - Téléphone
   - Propriété à associer
3. Cliquez sur "Envoyer l'invitation"

## Suivi des Invitations

- **En attente** : L'invitation a été envoyée
- **Acceptée** : Le locataire a créé son compte
- **Expirée** : L'invitation n'est plus valide (7 jours)

## Communication avec les Locataires

- Messages intégrés dans l'application
- Notifications automatiques pour les paiements
- Partage sécurisé de documents
      `,
      status: 'published'
    },
    {
      id: 'payments',
      title: 'Suivi des Paiements',
      description: 'Gérer les loyers et charges',
      type: 'guide',
      content: `
# Suivi des Paiements

## Types de Paiements

- **Loyer** : Paiement mensuel principal
- **Charges** : Charges locatives (eau, électricité, etc.)
- **Caution** : Dépôt de garantie
- **Frais** : Frais divers (état des lieux, etc.)

## Enregistrer un Paiement

1. Sélectionnez le locataire
2. Choisissez le type de paiement
3. Indiquez le montant et la date
4. Ajoutez une note si nécessaire
5. Validez l'enregistrement

## Générer des Quittances

- Quittances automatiques après chaque paiement
- Export PDF pour envoi au locataire
- Archivage automatique dans les documents
      `,
      status: 'published'
    },
    {
      id: 'maintenance',
      title: 'Gestion de la Maintenance',
      description: 'Demandes et suivi des interventions',
      type: 'guide',
      content: `
# Gestion de la Maintenance

## Créer une Demande de Maintenance

1. Accédez à "Maintenance" → "Nouvelle demande"
2. Remplissez les détails :
   - Propriété concernée
   - Type d'intervention
   - Description du problème
   - Urgence (faible, moyenne, élevée)
3. Assignez à un prestataire si disponible

## Suivi des Interventions

- **Créée** : Demande enregistrée
- **Assignée** : Prestataire désigné
- **En cours** : Intervention en cours
- **Terminée** : Travaux terminés
- **Facturée** : Facture reçue

## Gestion des Prestataires

- Ajout de prestataires de confiance
- Historique des interventions
- Notes et évaluations
      `,
      status: 'published'
    },
    {
      id: 'subscription',
      title: 'Gestion de l\'Abonnement',
      description: 'Plans, facturation et limitations',
      type: 'guide',
      content: `
# Gestion de l'Abonnement

## Plans Disponibles

### Plan Gratuit
- 1 propriété maximum
- 1 locataire maximum
- Fonctionnalités de base

### Plan Standard (9€/mois)
- 10 propriétés maximum
- Locataires illimités
- Rapports avancés
- Export de données
- Support prioritaire

### Plan Pro (19€/mois)
- Propriétés illimitées
- Toutes les fonctionnalités
- Rapports financiers avancés
- Support dédié

## Changer d'Abonnement

1. Accédez à "Abonnement"
2. Sélectionnez votre nouveau plan
3. Procédez au paiement sécurisé via Stripe
4. Activation immédiate

## Gérer votre Abonnement

- Modification des informations de paiement
- Historique des factures
- Annulation (possible à tout moment)
      `,
      status: 'published'
    },
    {
      id: 'api',
      title: 'Documentation API',
      description: 'Intégration et développeurs',
      type: 'api',
      url: 'https://supabase.com/dashboard/project/jhjhzwbvmkurwfohjxlu',
      status: 'published'
    },
    {
      id: 'faq',
      title: 'Questions Fréquentes',
      description: 'Réponses aux questions courantes',
      type: 'faq',
      content: `
# Questions Fréquentes

## Q: Comment inviter un locataire ?
**R:** Accédez au menu "Locataires", cliquez sur "Inviter un locataire", remplissez le formulaire et envoyez l'invitation par email.

## Q: Que faire si un locataire n'arrive pas à se connecter ?
**R:** Vérifiez que l'invitation n'a pas expiré (7 jours). Si c'est le cas, renvoyez une nouvelle invitation.

## Q: Comment générer une quittance de loyer ?
**R:** Enregistrez d'abord le paiement du loyer, puis une quittance sera automatiquement générée et disponible en téléchargement.

## Q: Puis-je importer mes données existantes ?
**R:** Actuellement, l'import de données se fait manuellement. Contactez le support pour une assistance personnalisée.

## Q: Comment annuler mon abonnement ?
**R:** Accédez à "Abonnement" → "Gérer l'abonnement" → "Annuler". L'annulation prend effet à la fin de la période facturée.

## Q: Mes données sont-elles sécurisées ?
**R:** Oui, toutes les données sont chiffrées et stockées de manière sécurisée. Nous respectons le RGPD.
      `,
      status: 'published'
    }
  ];

  const rollbackPlans: RollbackPlan[] = [
    {
      id: 'database-rollback',
      name: 'Restauration Base de Données',
      description: 'Restaurer la base de données à un point de sauvegarde antérieur',
      steps: [
        'Identifier le point de restauration (timestamp)',
        'Mettre l\'application en mode maintenance',
        'Exécuter la restauration via Supabase Dashboard',
        'Vérifier l\'intégrité des données',
        'Redémarrer les services',
        'Retirer le mode maintenance',
        'Notifier les utilisateurs'
      ],
      estimatedTime: '15-30 minutes',
      riskLevel: 'medium',
      lastTested: new Date('2024-01-15')
    },
    {
      id: 'edge-function-rollback',
      name: 'Rollback Edge Functions',
      description: 'Restaurer les edge functions à une version antérieure',
      steps: [
        'Identifier la version stable précédente',
        'Redéployer les fonctions via Git/Supabase CLI',
        'Tester les fonctions critiques',
        'Vérifier les logs d\'erreur',
        'Confirmer le bon fonctionnement'
      ],
      estimatedTime: '5-10 minutes',
      riskLevel: 'low',
      lastTested: new Date('2024-01-20')
    },
    {
      id: 'full-system-rollback',
      name: 'Rollback Système Complet',
      description: 'Restauration complète à un état antérieur stable',
      steps: [
        'Activer la page de maintenance',
        'Sauvegarder l\'état actuel',
        'Restaurer la base de données',
        'Redéployer l\'application frontend',
        'Restaurer les edge functions',
        'Vérifier tous les services',
        'Tests de fumée complets',
        'Retirer la page de maintenance'
      ],
      estimatedTime: '45-60 minutes',
      riskLevel: 'high',
      lastTested: new Date('2024-01-10')
    }
  ];

  const executeRollback = (planId: string) => {
    toast({
      title: "Plan de Rollback",
      description: `Exécution du plan "${rollbackPlans.find(p => p.id === planId)?.name}" - Consultez la documentation pour les étapes détaillées`,
      variant: "destructive"
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <BookOpen className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'api':
        return <FileText className="h-4 w-4" />;
      case 'faq':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedDoc = documentationSections.find(doc => doc.id === selectedSection);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Documentation & Plan de Rollback</h1>
        <p className="text-muted-foreground">
          Documentation utilisateur complète et procédures de récupération
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu de Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {documentationSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                      selectedSection === section.id ? 'bg-muted border-r-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getTypeIcon(section.type)}
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu Principal */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedDoc && getTypeIcon(selectedDoc.type)}
                  {selectedDoc?.title}
                </div>
                <div className="flex items-center gap-2">
                  {selectedDoc?.status && (
                    <Badge variant={selectedDoc.status === 'published' ? 'default' : 'secondary'}>
                      {selectedDoc.status === 'published' ? 'Publié' : 'Brouillon'}
                    </Badge>
                  )}
                  {selectedDoc?.url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={selectedDoc.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ouvrir
                      </a>
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDoc?.content ? (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {selectedDoc.content}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Documentation externe - Cliquez sur "Ouvrir" pour accéder</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plans de Rollback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Plans de Rollback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rollbackPlans.map((plan) => (
              <Card key={plan.id} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{plan.name}</span>
                    <Badge className={getRiskColor(plan.riskLevel)}>
                      {plan.riskLevel.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Durée estimée: </span>
                    <span className="text-sm">{plan.estimatedTime}</span>
                  </div>
                  
                  {plan.lastTested && (
                    <div>
                      <span className="text-sm font-medium">Dernier test: </span>
                      <span className="text-sm">
                        {plan.lastTested.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-medium mb-2 block">Étapes:</span>
                    <ol className="text-xs space-y-1 list-decimal list-inside text-muted-foreground">
                      {plan.steps.slice(0, 3).map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                      {plan.steps.length > 3 && (
                        <li>... et {plan.steps.length - 3} autres étapes</li>
                      )}
                    </ol>
                  </div>

                  <Button
                    onClick={() => executeRollback(plan.id)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Voir les détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contacts d'Urgence */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Contacts d'Urgence :</strong>
          <div className="mt-2 space-y-1">
            <div>• Support Technique: support@yourapp.com</div>
            <div>• Urgences Production: +33 1 XX XX XX XX</div>
            <div>• Documentation: https://docs.yourapp.com</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};