import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Freemium",
    price: "Free",
    features: [
      "Up to 2 properties",
      "Rent management",
      "Digital documents",
    ],
    buttonText: "Get Started Free",
  },
  {
    name: "Pro",
    price: "39.99",
    popular: true,
    features: [
      "Up to 5 properties",
      "Rent management",
      "Digital documents",
      "Mobile app",
      "Tenant screening",
      "Priority support",
    ],
    buttonText: "Start Now",
  },
  {
    name: "Enterprise",
    price: "99.99",
    features: [
      "Up to 20 properties",
      "Rent management",
      "Digital documents",
      "Mobile app",
      "Tenant screening",
      "24/7 Priority support",
    ],
    buttonText: "Start Now",
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-gray-50" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple and transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that best suits your needs
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
                    Most Popular
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
                      <span className="text-4xl font-bold tracking-tight">CA${plan.price}</span>
                      <span className="ml-1 text-sm font-semibold">/month</span>
                    </>
                  )}
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