import { Shield, Lock, Database, Eye, UserCheck, Globe, ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Security() {
  const { t } = useLocale();
  const navigate = useNavigate();

  const securityFeatures = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using AES-256 encryption",
      details: "Your sensitive property and tenant information is protected with military-grade encryption"
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      description: "Multi-factor authentication and secure password requirements",
      details: "Advanced authentication protocols to ensure only authorized users access your data"
    },
    {
      icon: Database,
      title: "Data Backup & Recovery",
      description: "Automated daily backups with 99.9% uptime guarantee",
      details: "Your data is safely backed up across multiple secure data centers"
    },
    {
      icon: Eye,
      title: "Privacy Protection",
      description: "GDPR compliant with strict privacy controls and data minimization",
      details: "We only collect necessary data and give you full control over your information"
    },
    {
      icon: UserCheck,
      title: "Role-Based Access",
      description: "Granular permission controls for different user types",
      details: "Control exactly what data each team member can access and modify"
    },
    {
      icon: Globe,
      title: "Compliance Standards",
      description: "SOC 2 Type II certified with regular third-party security audits",
      details: "Meet industry standards and regulatory requirements for data protection"
    }
  ];

  const certifications = [
    {
      title: "SOC 2 Type II",
      description: "Independently verified security controls"
    },
    {
      title: "GDPR Compliant",
      description: "European data protection standards"
    },
    {
      title: "ISO 27001",
      description: "Information security management"
    },
    {
      title: "CCPA Compliant",
      description: "California privacy protection"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-8 text-gray-600 hover:text-[#ea384c] hover:border-[#ea384c]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          <Shield className="h-16 w-16 text-[#ea384c] mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Security & Privacy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your property data deserves the highest level of protection. We use enterprise-grade security measures to keep your information safe and secure.
          </p>
          <Button 
            size="lg" 
            className="bg-[#ea384c] hover:bg-[#d31c3f]"
            onClick={() => navigate('/auth')}
          >
            Start Secure Trial
          </Button>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How We Protect Your Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ea384c] to-[#d31c3f] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-700 mb-3">
                      {feature.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {feature.details}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compliance & Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-slate-200 hover:border-[#ea384c] transition-colors">
                <div className="w-12 h-12 bg-[#ea384c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Practices */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Data Protection Practices
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Minimization</h3>
                <p className="text-gray-600">We only collect the minimum data necessary to provide our services and never share your information with third parties without your explicit consent.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Regular Security Audits</h3>
                <p className="text-gray-600">Our security practices are regularly reviewed by independent third-party security firms to ensure we meet the highest standards.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Incident Response</h3>
                <p className="text-gray-600">We have a comprehensive incident response plan and will notify you immediately if any security issues affect your data.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Right to Control</h3>
                <p className="text-gray-600">You maintain full control over your data with the ability to export, modify, or delete your information at any time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#ea384c] to-[#d31c3f]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Questions About Security?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our security team is here to address any concerns you may have
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/contact')}
            >
              Contact Security Team
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#ea384c]"
              onClick={() => navigate('/privacy')}
            >
              Read Privacy Policy
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}