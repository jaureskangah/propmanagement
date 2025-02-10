
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Freemium",
    price: "Free",
    features: [
      "Jusqu'à 2 propriétés",
      "Gestion des loyers",
      "Documents numériques",
      "Fiches propriétés basiques",
      "Notifications email",
      "Support communautaire",
    ],
    buttonText: "Commencer gratuitement",
    priceId: null,
  },
  {
    name: "Pro",
    price: "39.99",
    popular: true,
    features: [
      "Jusqu'à 5 propriétés",
      "Gestion des loyers",
      "Documents numériques",
      "Application mobile",
      "Vérification des locataires",
      "Support prioritaire",
      "Tableau de bord avancé",
      "Rapports financiers",
      "Gestion des maintenances",
      "Paiements en ligne",
    ],
    buttonText: "Commencer maintenant",
    priceId: "price_1QdEX1A44huL2zb1OfGwbzzn",
  },
  {
    name: "Enterprise",
    price: "99.99",
    features: [
      "Jusqu'à 20 propriétés",
      "Gestion des loyers",
      "Documents numériques",
      "Application mobile",
      "Vérification des locataires",
      "Support 24/7 dédié",
      "Tableau de bord personnalisé",
      "Rapports financiers avancés",
      "Gestion des maintenances",
      "Paiements en ligne",
      "API personnalisée",
      "Formation utilisateurs",
      "Backup quotidien",
      "Analyses prédictives",
    ],
    buttonText: "Commencer maintenant",
    priceId: "price_1QdEXVA44huL2zb1cvLhmUtK",
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      navigate("/dashboard");
      return;
    }

    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour souscrire à un abonnement",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Traitement en cours",
        description: "Préparation de votre session de paiement...",
      });

      console.log('Creating checkout session for price:', priceId);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Erreur",
          description: error.message || "Échec de la création de la session de paiement",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received');
        toast({
          title: "Erreur",
          description: "Échec de la création de la session de paiement - pas d'URL reçue",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du traitement de votre demande",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tarification simple et transparente
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
                plan.popular ? 'border-[#ea384c] shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#ea384c] text-white text-sm font-medium px-3 py-1 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 flex items-baseline text-gray-900">
                  {plan.price === "Free" ? (
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tracking-tight">€{plan.price}</span>
                      <span className="ml-1 text-sm font-semibold">/mois</span>
                    </>
                  )}
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-[#ea384c] hover:bg-[#d41f32] text-white"
                  onClick={() => handleSubscribe(plan.priceId)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
