import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Users, Wrench, DollarSign, LogIn, List, Gift, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/auth/AuthModal";

const LandingPage = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">RentEase</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                <List className="h-4 w-4" />
                <span>Fonctionnalités</span>
              </a>
              <a href="#pricing" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                <DollarSign className="h-4 w-4" />
                <span>Tarifs</span>
              </a>
              <a href="#testimonials" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors">
                <Star className="h-4 w-4" />
                <span>Témoignages</span>
              </a>
              {user ? (
                <Button asChild variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/dashboard">
                    Tableau de bord
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowAuthModal(true)}
                >
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Button>
              )}
            </nav>

            <Button variant="ghost" size="icon" className="md:hidden">
              <List className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent animate-fade-in">
              Simplifiez votre gestion immobilière
            </h1>
            <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in delay-100">
              Une solution complète pour gérer vos propriétés, locataires et maintenance en toute simplicité.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in delay-200">
              <Button size="lg" className="group bg-blue-600 hover:bg-blue-700" onClick={() => setShowAuthModal(true)}>
                Commencer gratuitement
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                En savoir plus
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Des outils puissants pour une gestion efficace de votre portefeuille immobilier
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestion des biens</h3>
              <p className="text-slate-600">
                Suivez vos propriétés et leur performance en temps réel
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestion des locataires</h3>
              <p className="text-slate-600">
                Gérez facilement vos locataires et leurs documents
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Maintenance</h3>
              <p className="text-slate-600">
                Suivez et gérez les demandes de maintenance
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Sécurité</h3>
              <p className="text-slate-600">
                Vos données sont sécurisées et protégées
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Découvrez pourquoi les propriétaires font confiance à RentEase
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Martin",
                role: "Propriétaire",
                content: "RentEase a complètement transformé ma façon de gérer mes biens immobiliers. Tout est tellement plus simple maintenant !"
              },
              {
                name: "Thomas Dubois",
                role: "Investisseur immobilier",
                content: "Une solution complète qui m'a permis de gagner un temps précieux dans la gestion de mon portefeuille."
              },
              {
                name: "Marie Lambert",
                role: "Gestionnaire immobilier",
                content: "L'interface est intuitive et les fonctionnalités sont exactement ce dont j'avais besoin. Je recommande !"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Des tarifs adaptés à vos besoins
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Choisissez le plan qui vous convient le mieux
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Débutant",
                price: "0€",
                period: "par mois",
                features: ["Jusqu'à 3 propriétés", "Gestion des locataires", "Support par email"],
                cta: "Commencer gratuitement"
              },
              {
                name: "Pro",
                price: "29€",
                period: "par mois",
                features: ["Propriétés illimitées", "Gestion avancée", "Support prioritaire", "Rapports personnalisés"],
                cta: "Essayer 14 jours gratuits",
                highlighted: true
              },
              {
                name: "Entreprise",
                price: "Sur mesure",
                period: "",
                features: ["Fonctionnalités personnalisées", "API dédiée", "Support dédié", "Formation incluse"],
                cta: "Nous contacter"
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-xl border ${
                  plan.highlighted ? 'border-blue-500 shadow-blue-100' : 'border-blue-100'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-600">/{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlighted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => setShowAuthModal(true)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à simplifier votre gestion ?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de propriétaires qui font confiance à notre solution
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="group bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => setShowAuthModal(true)}
            >
              Essayer gratuitement
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default LandingPage;