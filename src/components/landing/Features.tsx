
import { Building2, Users, Wrench, Shield } from "lucide-react";

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Everything You Need
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Powerful tools for efficient management of your real estate portfolio
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Building2 className="text-[#ea384c]" />}
          title="Property Management"
          description="Track your properties and their performance in real-time"
        />
        <FeatureCard
          icon={<Users className="text-[#ea384c]" />}
          title="Tenant Management"
          description="Easily manage your tenants and their documents"
        />
        <FeatureCard
          icon={<Wrench className="text-[#ea384c]" />}
          title="Maintenance"
          description="Track and manage maintenance requests"
        />
        <FeatureCard
          icon={<Shield className="text-[#ea384c]" />}
          title="Security"
          description="Your data is secure and protected"
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
