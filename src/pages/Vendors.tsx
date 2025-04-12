
import React from 'react';
import { VendorList } from '@/components/maintenance/vendors/VendorList';
import { Card, CardContent } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Users, Phone, Star, History, Calendar } from 'lucide-react';

const Vendors = () => {
  const { t } = useLocale();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">{t('vendors')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full p-3 bg-blue-100 mr-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t('allVendors')}</h2>
                <p className="text-sm text-muted-foreground">Manage your vendors</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-red-500">
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full p-3 bg-red-100 mr-4">
                <Phone className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t('emergencyContacts')}</h2>
                <p className="text-sm text-muted-foreground">Quick access to emergency services</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-amber-500">
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full p-3 bg-amber-100 mr-4">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t('reviews')}</h2>
                <p className="text-sm text-muted-foreground">Vendor performance reviews</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full p-3 bg-green-100 mr-4">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t('appointments')}</h2>
                <p className="text-sm text-muted-foreground">Schedule and manage appointments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <VendorList />
    </div>
  );
};

export default Vendors;
