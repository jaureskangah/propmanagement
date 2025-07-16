import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Nous accordons une grande importance à la protection de votre vie privée. Cette politique de confidentialité 
              explique comment nous collectons, utilisons, divulguons et protégeons vos informations personnelles lorsque 
              vous utilisez notre plateforme de gestion immobilière.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Informations que nous collectons</h2>
            <h3 className="text-lg font-semibold mb-2">2.1 Informations que vous nous fournissez</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Informations de compte (nom, adresse e-mail, mot de passe)</li>
              <li>Informations de profil (coordonnées, préférences)</li>
              <li>Données de propriété (adresses, descriptions, photos)</li>
              <li>Informations sur les locataires (nom, coordonnées, documents)</li>
              <li>Données financières (loyers, charges, paiements)</li>
              <li>Communications (messages, demandes de maintenance)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">2.2 Informations collectées automatiquement</h3>
            <ul className="list-disc pl-6">
              <li>Données d'utilisation et de navigation</li>
              <li>Adresse IP et informations sur l'appareil</li>
              <li>Cookies et technologies similaires</li>
              <li>Logs de connexion et d'activité</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Utilisation de vos informations</h2>
            <p className="mb-4">Nous utilisons vos informations pour :</p>
            <ul className="list-disc pl-6">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et vos propriétés</li>
              <li>Faciliter la communication entre propriétaires et locataires</li>
              <li>Traiter les paiements et transactions</li>
              <li>Envoyer des notifications importantes</li>
              <li>Assurer la sécurité de la plateforme</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Partage d'informations</h2>
            <p className="mb-4">Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations dans les cas suivants :</p>
            <ul className="list-disc pl-6">
              <li><strong>Avec votre consentement :</strong> Lorsque vous autorisez explicitement le partage</li>
              <li><strong>Prestataires de services :</strong> Fournisseurs de paiement, hébergement cloud, support client</li>
              <li><strong>Obligations légales :</strong> Lorsque requis par la loi ou les autorités compétentes</li>
              <li><strong>Sécurité :</strong> Pour protéger nos droits, votre sécurité ou celle d'autrui</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Sécurité des données</h2>
            <p className="mb-4">Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations :</p>
            <ul className="list-disc pl-6">
              <li>Chiffrement des données en transit et au repos</li>
              <li>Authentification sécurisée</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Surveillance continue de la sécurité</li>
              <li>Sauvegardes régulières</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
            <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6">
              <li><strong>Accès :</strong> Obtenir une copie de vos données personnelles</li>
              <li><strong>Rectification :</strong> Corriger les informations inexactes</li>
              <li><strong>Effacement :</strong> Demander la suppression de vos données</li>
              <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
              <li><strong>Opposition :</strong> Vous opposer au traitement de vos données</li>
              <li><strong>Limitation :</strong> Limiter le traitement de vos données</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à l'adresse : <strong>privacy@propmanagement.app</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p className="mb-4">
              Nous utilisons des cookies pour améliorer votre expérience, analyser l'utilisation du site et personnaliser le contenu. 
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter 
              nos obligations légales. Les données inactives sont supprimées selon nos politiques de rétention.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Transferts internationaux</h2>
            <p>
              Vos données peuvent être transférées et traitées dans des pays autres que votre pays de résidence. 
              Nous nous assurons que de tels transferts respectent les exigences du RGPD.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Modifications</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité occasionnellement. Les modifications importantes 
              vous seront notifiées par e-mail ou via notre plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
            <p className="mb-4">Pour toute question concernant cette politique de confidentialité, contactez-nous :</p>
            <ul className="list-none">
              <li><strong>E-mail :</strong> privacy@propmanagement.app</li>
              <li><strong>Adresse :</strong> [Votre adresse postale]</li>
              <li><strong>Délégué à la protection des données :</strong> dpo@propmanagement.app</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}