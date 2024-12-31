import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Basic",
    price: "29",
    features: [
      "Jusqu'à 5 propriétés",
      "Gestion des locataires",
      "Suivi des paiements",
      "Support par email",
    ],
  },
  {
    name: "Pro",
    price: "79",
    popular: true,
    features: [
      "Jusqu'à 20 propriétés",
      "Gestion des locataires",
      "Suivi des paiements",
      "Support prioritaire",
      "Rapports avancés",
      "Documents personnalisés",
    ],
  },
  {
    name: "Enterprise",
    price: "199",
    features: [
      "Propriétés illimitées",
      "Gestion des locataires",
      "Suivi des paiements",
      "Support dédié 24/7",
      "Rapports avancés",
      "Documents personnalisés",
      "API access",
      "Intégrations personnalisées",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Des prix simples et transparents
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choisissez le plan qui correspond le mieux à vos besoins
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? 'border-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                    Plus populaire
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 flex items-baseline text-gray-900">
                  <span className="text-4xl font-bold tracking-tight">€{plan.price}</span>
                  <span className="ml-1 text-sm font-semibold">/mois</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
                >
                  Commencer maintenant
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}