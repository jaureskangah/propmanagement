
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Comment puis-je commencer à utiliser la plateforme ?",
    answer: "C'est très simple ! Créez un compte gratuitement, ajoutez vos propriétés et commencez à gérer vos biens immobiliers en quelques minutes. Notre interface intuitive vous guidera à chaque étape."
  },
  {
    question: "Quelles fonctionnalités sont incluses dans l'abonnement de base ?",
    answer: "L'abonnement de base comprend la gestion des propriétés, le suivi des paiements, la gestion des documents, et la communication avec les locataires. Vous avez accès à toutes les fonctionnalités essentielles pour une gestion efficace."
  },
  {
    question: "Puis-je gérer plusieurs propriétés ?",
    answer: "Oui, vous pouvez gérer autant de propriétés que vous le souhaitez. Notre plateforme est conçue pour s'adapter à votre portefeuille immobilier, que vous ayez une ou plusieurs propriétés."
  },
  {
    question: "Comment fonctionne la communication avec les locataires ?",
    answer: "Notre système de messagerie intégré permet une communication directe et efficace avec vos locataires. Vous pouvez envoyer des notifications, répondre aux demandes et partager des documents, le tout depuis une interface centralisée."
  },
  {
    question: "Les données sont-elles sécurisées ?",
    answer: "La sécurité est notre priorité. Toutes les données sont cryptées et stockées de manière sécurisée. Nous utilisons les dernières technologies de sécurité pour protéger vos informations et celles de vos locataires."
  },
  {
    question: "Puis-je exporter mes données ?",
    answer: "Oui, vous pouvez exporter vos données à tout moment dans différents formats (PDF, Excel). Cela vous permet de garder une trace de votre activité et de générer des rapports personnalisés."
  }
];

export default function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border border-red-100 rounded-lg px-4 hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4 text-slate-900 font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
