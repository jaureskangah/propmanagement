import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Users, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F0FB] via-[#E5DEFF] to-[#F1F0FB]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent animate-fade-in">
            Simplifiez votre gestion immobilière
          </h1>
          <p className="text-slate-600 text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in delay-100">
            Une solution complète pour gérer vos propriétés, vos locataires et vos maintenances en toute simplicité.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in delay-200">
            <Button asChild size="lg" className="group">
              <Link to="/properties">
                Commencer maintenant
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Des outils puissants pour une gestion efficace de votre patrimoine immobilier
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestion des biens</h3>
            <p className="text-slate-600">
              Suivez vos propriétés et leurs performances en temps réel
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestion des locataires</h3>
            <p className="text-slate-600">
              Gérez facilement vos locataires et leurs documents
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Wrench className="text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Maintenance</h3>
            <p className="text-slate-600">
              Suivez et gérez les demandes de maintenance
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Sécurité</h3>
            <p className="text-slate-600">
              Vos données sont sécurisées et protégées
            </p>
          </div>
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
          <Button asChild size="lg" variant="secondary" className="group">
            <Link to="/signup">
              Essayer gratuitement
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;