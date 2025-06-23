
import { Building2, Users, Wrench, Shield } from "lucide-react";
import { useLocale } from "../providers/LocaleProvider";
import { useEffect, useRef, useState } from "react";

export default function OptimizedFeatures() {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Building2 className="text-[#ea384c]" />,
      title: t('propertyManagement'),
      description: t('propertyManagementDesc'),
    },
    {
      icon: <Users className="text-[#ea384c]" />,
      title: t('tenantManagement'),
      description: t('tenantManagementDesc'),
    },
    {
      icon: <Wrench className="text-[#ea384c]" />,
      title: t('maintenance'),
      description: t('maintenanceDesc'),
    },
    {
      icon: <Shield className="text-[#ea384c]" />,
      title: t('security'),
      description: t('securityDesc'),
    },
  ];

  return (
    <div
      id="everything-you-need"
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className={`text-center mb-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {t('everythingYouNeed')}
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          {t('featuresSubtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-white/80 backdrop-blur-lg p-6 rounded-xl border border-red-100 shadow-lg transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
              animationFillMode: 'both'
            }}
          >
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
