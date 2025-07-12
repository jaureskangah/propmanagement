import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Loader2, Building2, Users, Wrench } from "lucide-react";
import { GlobalExportOptions } from "../shared/GlobalExportOptions";

export const PropertyReports = () => {
  const { t } = useLocale();
  
  // Fonction pour traduire le type de propriété
  const getTranslatedPropertyType = (type: string) => {
    const typeMap: Record<string, string> = {
      'Apartment': t('apartment'),
      'House': t('house'), 
      'Condo': t('condo'),
      'Office': t('propertyOffice'),
      'Commercial Space': t('commercialspace')
    };
    return typeMap[type] || type;
  };

  // Fetch properties and related data
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tenants').select('*, properties(name)');
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenance = [], isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          tenants!inner (
            id,
            name,
            property_id,
            properties (
              id,
              name
            )
          )
        `);
      if (error) throw error;
      console.log("Maintenance data:", data);
      return data;
    }
  });

  const isLoading = isLoadingProperties || isLoadingTenants || isLoadingMaintenance;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const propertyData = {
    properties,
    tenants,
    maintenance
  };

  // Calculate property metrics
  const propertyMetrics = properties.map(property => {
    const propertyTenants = tenants.filter(tenant => tenant.property_id === property.id);
    
    // Filtrer les demandes de maintenance pour cette propriété
    const propertyMaintenance = maintenance.filter(item => {
      // Vérifier si la demande de maintenance est liée à un locataire de cette propriété
      return item.tenants && item.tenants.property_id === property.id;
    });
    
    console.log(`Property ${property.name}:`, {
      propertyTenants: propertyTenants.length,
      propertyMaintenance: propertyMaintenance.length,
      maintenanceItems: propertyMaintenance
    });
    
    const occupancyRate = property.units > 0 ? Math.round((propertyTenants.length / property.units) * 100) : 0;
    const pendingMaintenance = propertyMaintenance.filter(item => 
      item.status === 'pending' || item.status === 'Pending'
    ).length;

    return {
      ...property,
      tenantCount: propertyTenants.length,
      occupancyRate,
      pendingMaintenance,
      totalMaintenance: propertyMaintenance.length
    };
  });

  return (
    <div className="space-y-6">
      {/* Header with export options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('propertyReports', { fallback: 'Rapports par Propriété' })}
          </h2>
          <p className="text-muted-foreground">
            {t('detailedPropertyAnalysis', { fallback: 'Analyse détaillée par propriété' })}
          </p>
        </div>
        <GlobalExportOptions data={propertyData} type="property" />
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyMetrics.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {property.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{property.address}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Property Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{t('type', { fallback: 'Type' })}</p>
                    <p className="text-muted-foreground">{getTranslatedPropertyType(property.type)}</p>
                  </div>
                  <div>
                    <p className="font-medium">{t('units', { fallback: 'Unités' })}</p>
                    <p className="text-muted-foreground">{property.units}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{t('tenants', { fallback: 'Locataires' })}</span>
                    </div>
                    <span className="font-medium">{property.tenantCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('occupancyRate', { fallback: 'Taux d\'occupation' })}</span>
                    <span className={`font-medium ${property.occupancyRate >= 80 ? 'text-green-600' : property.occupancyRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {property.occupancyRate}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">{t('maintenance', { fallback: 'Maintenance' })}</span>
                    </div>
                    <span className="font-medium">
                      {property.pendingMaintenance}/{property.totalMaintenance}
                    </span>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('occupied', { fallback: 'Occupé' })}</span>
                    <span>{property.tenantCount}/{property.units}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${property.occupancyRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('propertySummary', { fallback: 'Résumé des Propriétés' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t('property', { fallback: 'Propriété' })}</th>
                  <th className="text-left p-2">{t('type', { fallback: 'Type' })}</th>
                  <th className="text-center p-2">{t('units', { fallback: 'Unités' })}</th>
                  <th className="text-center p-2">{t('tenants', { fallback: 'Locataires' })}</th>
                  <th className="text-center p-2">{t('occupancy', { fallback: 'Occupation' })}</th>
                  <th className="text-center p-2">{t('maintenance', { fallback: 'Maintenance' })}</th>
                </tr>
              </thead>
              <tbody>
                {propertyMetrics.map((property) => (
                  <tr key={property.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{property.name}</td>
                    <td className="p-2">{getTranslatedPropertyType(property.type)}</td>
                    <td className="p-2 text-center">{property.units}</td>
                    <td className="p-2 text-center">{property.tenantCount}</td>
                    <td className="p-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.occupancyRate >= 80 ? 'bg-green-100 text-green-800' :
                        property.occupancyRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.occupancyRate}%
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      {property.pendingMaintenance > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          {property.pendingMaintenance}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};