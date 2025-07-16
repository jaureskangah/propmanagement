import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant notre plateforme de gestion immobilière, vous acceptez d'être lié par ces 
              conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
            <p className="mb-4">Notre plateforme offre des services de gestion immobilière incluant :</p>
            <ul className="list-disc pl-6">
              <li>Gestion des propriétés et des locataires</li>
              <li>Suivi des paiements et des finances</li>
              <li>Gestion des demandes de maintenance</li>
              <li>Communication entre propriétaires et locataires</li>
              <li>Génération de documents et rapports</li>
              <li>Outils d'analyse et de reporting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Inscription et compte utilisateur</h2>
            <h3 className="text-lg font-semibold mb-2">3.1 Éligibilité</h3>
            <p className="mb-4">
              Vous devez être âgé d'au moins 18 ans et avoir la capacité juridique pour conclure des contrats.
            </p>

            <h3 className="text-lg font-semibold mb-2">3.2 Informations de compte</h3>
            <p className="mb-4">
              Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription. 
              Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion.
            </p>

            <h3 className="text-lg font-semibold mb-2">3.3 Responsabilité du compte</h3>
            <p>
              Vous êtes entièrement responsable de toutes les activités qui se produisent sous votre compte.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Utilisation acceptable</h2>
            <h3 className="text-lg font-semibold mb-2">4.1 Utilisations autorisées</h3>
            <p className="mb-4">Vous pouvez utiliser notre service uniquement pour des fins légales et conformément à ces conditions.</p>

            <h3 className="text-lg font-semibold mb-2">4.2 Utilisations interdites</h3>
            <p className="mb-4">Il est interdit d'utiliser notre service pour :</p>
            <ul className="list-disc pl-6">
              <li>Des activités illégales ou frauduleuses</li>
              <li>Violer les droits de propriété intellectuelle</li>
              <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
              <li>Diffuser du contenu offensant, diffamatoire ou inapproprié</li>
              <li>Tenter de compromettre la sécurité du système</li>
              <li>Utiliser des robots, scripts ou autres moyens automatisés</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Tarification et paiements</h2>
            <h3 className="text-lg font-semibold mb-2">5.1 Abonnements</h3>
            <p className="mb-4">
              Nos services sont proposés selon différents plans d'abonnement. Les tarifs sont indiqués sur notre site web 
              et peuvent être modifiés avec un préavis de 30 jours.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.2 Facturation</h3>
            <p className="mb-4">
              Les frais d'abonnement sont facturés à l'avance selon la période choisie (mensuelle ou annuelle). 
              Le paiement est dû au début de chaque période de facturation.
            </p>

            <h3 className="text-lg font-semibold mb-2">5.3 Remboursements</h3>
            <p>
              Les frais payés ne sont généralement pas remboursables, sauf disposition contraire de la loi applicable 
              ou accord spécifique de notre part.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Propriété intellectuelle</h2>
            <p className="mb-4">
              Tous les droits de propriété intellectuelle sur notre plateforme, y compris le logiciel, le design, 
              les marques et le contenu, nous appartiennent ou font l'objet de licences en notre faveur.
            </p>
            <p>
              Vous conservez tous les droits sur le contenu que vous uploadez, mais nous accordez une licence 
              d'utilisation nécessaire à la fourniture de nos services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Protection des données</h2>
            <p>
              Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité 
              et aux réglementations applicables, notamment le RGPD.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation de responsabilité</h2>
            <p className="mb-4">
              Dans les limites autorisées par la loi, nous ne saurions être tenus responsables des dommages indirects, 
              accessoires, spéciaux ou consécutifs résultant de l'utilisation de notre service.
            </p>
            <p>
              Notre responsabilité totale ne saurait excéder les montants que vous avez payés pour nos services 
              au cours des 12 derniers mois.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnisation</h2>
            <p>
              Vous acceptez de nous indemniser et de nous dégager de toute responsabilité concernant les réclamations 
              résultant de votre utilisation de nos services ou de votre violation de ces conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Suspension et résiliation</h2>
            <h3 className="text-lg font-semibold mb-2">10.1 Résiliation par vous</h3>
            <p className="mb-4">
              Vous pouvez résilier votre compte à tout moment via les paramètres de votre compte ou en nous contactant.
            </p>

            <h3 className="text-lg font-semibold mb-2">10.2 Suspension/résiliation par nous</h3>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces conditions 
              ou d'utilisation inappropriée de nos services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Modifications des conditions</h2>
            <p>
              Nous pouvons modifier ces conditions à tout moment. Les modifications importantes vous seront notifiées 
              avec un préavis raisonnable. Votre utilisation continue du service constitue votre acceptation des conditions modifiées.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Droit applicable et juridiction</h2>
            <p>
              Ces conditions sont régies par le droit français. Tout litige sera soumis à la juridiction exclusive 
              des tribunaux français compétents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Dispositions générales</h2>
            <p className="mb-4">
              Si une disposition de ces conditions est déclarée invalide, les autres dispositions restent en vigueur. 
              Ces conditions constituent l'accord complet entre vous et nous concernant l'utilisation de nos services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
            <p className="mb-4">Pour toute question concernant ces conditions, contactez-nous :</p>
            <ul className="list-none">
              <li><strong>E-mail :</strong> legal@propmanagement.app</li>
              <li><strong>Adresse :</strong> [Votre adresse postale]</li>
              <li><strong>Support :</strong> support@propmanagement.app</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}