
import React from 'react';
import { VendorList } from '@/components/maintenance/vendors/VendorList';
import { useLocale } from '@/components/providers/LocaleProvider';

const Vendors = () => {
  const { t } = useLocale();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('vendors')}</h1>
        <p className="text-muted-foreground">
          Gérez vos prestataires et suivez leurs interventions
        </p>
      </div>
      
      <VendorList />
    </div>
  );
};

export default Vendors;
