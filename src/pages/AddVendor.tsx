
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VendorForm } from '@/components/maintenance/vendors/VendorForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddVendor = () => {
  const navigate = useNavigate();
  const { t } = useLocale();
  
  const handleCancel = () => {
    navigate('/maintenance');
  };
  
  const handleSuccess = () => {
    navigate('/maintenance');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
        <h1 className="text-3xl font-bold">{t('addVendor')}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('vendorDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <VendorForm onCancel={handleCancel} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVendor;
