
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TubelightNavBar } from '@/components/ui/tubelight-navbar';
import { LayoutDashboard, Wrench, FileText, Settings } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';

interface TenantDashboardNavProps {
  onSectionChange: (section: string) => void;
}

export const TenantDashboardNav = ({ onSectionChange }: TenantDashboardNavProps) => {
  const { t } = useLocale();
  const [searchParams] = useSearchParams();
  const currentSection = searchParams.get('section') || 'overview';

  const navItems = [
    { 
      name: t('overview'), 
      value: "overview", 
      icon: LayoutDashboard,
    },
    { 
      name: t('maintenance'), 
      value: "maintenance", 
      icon: Wrench,
    },
    { 
      name: t('documents'), 
      value: "documents", 
      icon: FileText,
    },
    { 
      name: t('settings'), 
      value: "settings", 
      icon: Settings,
    },
  ];

  const handleTabChange = (section: string) => {
    onSectionChange(section);
    // Mettre à jour l'URL sans recharger la page
    const newUrl = section === 'overview' ? '/tenant/dashboard' : `/tenant/dashboard?section=${section}`;
    window.history.replaceState({}, '', newUrl);
  };

  return (
    <div className="mobile-tabs-scroll">
      <TubelightNavBar
        items={navItems}
        activeTab={currentSection}
        onTabChange={handleTabChange}
        className="mb-8 mobile-full-width"
      />
    </div>
  );
};
