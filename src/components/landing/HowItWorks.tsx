
import { ArrowRight, ListChecks, Building2, MessageSquare, Search } from "lucide-react";

const steps = [
  {
    icon: <ListChecks className="w-12 h-12 text-[#ea384c]" />,
    title: "Créez votre compte",
    description: "Inscrivez-vous gratuitement et commencez à gérer vos propriétés en quelques minutes."
  },
  {
    icon: <Building2 className="w-12 h-12 text-[#ea384c]" />,
    title: "Ajoutez vos propriétés",
    description: "Enregistrez facilement vos biens immobiliers avec leurs caractéristiques détaillées."
  },
  {
    icon: <Search className="w-12 h-12 text-[#ea384c]" />,
    title: "Gérez vos locataires",
    description: "Suivez les paiements, les documents et les demandes de maintenance en un seul endroit."
  },
  {
    icon: <MessageSquare className="w-12 h-12 text-[#ea384c]" />,
    title: "Communication simplifiée",
    description: "Restez en contact avec vos locataires et gérez efficacement les demandes."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Comment ça marche
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Une solution simple et efficace pour la gestion de vos biens immobiliers
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-lg p-6 text-center relative z-10 h-full flex flex-col items-center group hover:shadow-xl transition-shadow duration-300">
                <div className="mb-4 p-3 bg-red-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  {step.title}
                </h3>
                <p className="text-slate-600">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0">
                  <ArrowRight className="w-8 h-8 text-[#ea384c]/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
