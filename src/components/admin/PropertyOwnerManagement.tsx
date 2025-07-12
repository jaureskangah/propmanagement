import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Search, 
  Building2, 
  Users, 
  DollarSign,
  Eye,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PropertyOwnerManagement = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch property owners with their properties and tenant data
  const { data: owners = [], isLoading } = useQuery({
    queryKey: ['admin_property_owners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          properties (
            id,
            name,
            address,
            type,
            units,
            tenants (
              id,
              name,
              rent_amount,
              lease_start,
              lease_end,
              tenant_payments (
                amount,
                payment_date,
                status
              )
            )
          )
        `)
        .not('properties', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter to only include users who actually own properties
      return (data || []).filter(user => user.properties && user.properties.length > 0);
    }
  });

  const filteredOwners = owners.filter(owner => 
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOwnerStats = (owner: any) => {
    const properties = owner.properties || [];
    const totalProperties = properties.length;
    const totalUnits = properties.reduce((sum: number, prop: any) => sum + (prop.units || 0), 0);
    
    let totalTenants = 0;
    let totalRevenue = 0;
    let activeTenants = 0;

    properties.forEach((property: any) => {
      const tenants = property.tenants || [];
      totalTenants += tenants.length;
      
      tenants.forEach((tenant: any) => {
        const now = new Date();
        const leaseEnd = new Date(tenant.lease_end);
        if (leaseEnd > now) {
          activeTenants++;
        }
        
        const payments = tenant.tenant_payments || [];
        totalRevenue += payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);
      });
    });

    const occupancyRate = totalUnits > 0 ? Math.round((activeTenants / totalUnits) * 100) : 0;

    return {
      totalProperties,
      totalUnits,
      totalTenants,
      activeTenants,
      totalRevenue,
      occupancyRate
    };
  };

  const handleViewDetails = (owner: any) => {
    toast({
      title: "Voir détails",
      description: `Affichage des détails pour ${owner.first_name} ${owner.last_name}`,
    });
    // TODO: Implémenter la navigation vers la page de détails
  };

  const handleManageProperties = (owner: any) => {
    toast({
      title: "Gérer propriétés",
      description: `Gestion des propriétés de ${owner.first_name} ${owner.last_name}`,
    });
    // TODO: Implémenter la navigation vers la page de gestion des propriétés
  };

  // Set up real-time subscriptions for automatic updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-property-owners-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin_property_owners'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin_property_owners'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenants'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin_property_owners'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_payments'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin_property_owners'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('propertyOwnerManagement', { fallback: 'Gestion des Propriétaires' })}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('managePropertyOwners', { fallback: 'Gérer les propriétaires et leurs biens immobiliers' })}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="animate-fade-in">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('searchOwners', { fallback: 'Rechercher des propriétaires...' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{t('totalOwners', { fallback: 'Propriétaires' })}</p>
                <p className="text-2xl font-bold text-foreground">{filteredOwners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{t('totalProperties', { fallback: 'Propriétés' })}</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredOwners.reduce((sum, owner) => sum + (owner.properties?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{t('totalTenants', { fallback: 'Locataires' })}</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredOwners.reduce((sum, owner) => {
                    const stats = getOwnerStats(owner);
                    return sum + stats.totalTenants;
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{t('totalRevenue', { fallback: 'Revenus' })}</p>
                <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                  ${filteredOwners.reduce((sum, owner) => {
                    const stats = getOwnerStats(owner);
                    return sum + stats.totalRevenue;
                  }, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Owners Table */}
      <div className="animate-fade-in">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Building2 className="h-5 w-5" />
              {t('propertyOwners', { fallback: 'Propriétaires' })}
              <Badge variant="secondary" className="ml-auto">
                {filteredOwners.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredOwners.map((owner) => {
                const stats = getOwnerStats(owner);
                
                return (
                  <Card key={owner.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                            {(owner.first_name?.[0] || owner.email?.[0] || '?').toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {owner.first_name && owner.last_name 
                                ? `${owner.first_name} ${owner.last_name}`
                                : owner.email?.split('@')[0] || 'N/A'
                              }
                            </div>
                            {owner.company && (
                              <div className="text-sm text-muted-foreground truncate">{owner.company}</div>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('actions', { fallback: 'Actions' })}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(owner)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('viewDetails', { fallback: 'Voir détails' })}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageProperties(owner)}>
                              <Building2 className="h-4 w-4 mr-2" />
                              {t('manageProperties', { fallback: 'Gérer propriétés' })}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{owner.email}</span>
                        </div>
                        {owner.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span>{owner.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-muted-foreground">Prop:</span>
                          <span className="text-sm font-medium">{stats.totalProperties}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-purple-600" />
                          <span className="text-xs text-muted-foreground">Loc:</span>
                          <span className="text-sm font-medium">{stats.activeTenants}/{stats.totalTenants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Occ:</span>
                          <Badge 
                            variant={stats.occupancyRate >= 80 ? "default" : stats.occupancyRate >= 60 ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {stats.occupancyRate}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-emerald-600" />
                          <span className="text-sm font-medium">${stats.totalRevenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('owner', { fallback: 'Propriétaire' })}</TableHead>
                    <TableHead>{t('contact', { fallback: 'Contact' })}</TableHead>
                    <TableHead>{t('properties', { fallback: 'Propriétés' })}</TableHead>
                    <TableHead>{t('tenants', { fallback: 'Locataires' })}</TableHead>
                    <TableHead>{t('occupancy', { fallback: 'Occupation' })}</TableHead>
                    <TableHead>{t('revenue', { fallback: 'Revenus' })}</TableHead>
                    <TableHead className="text-right">{t('actions', { fallback: 'Actions' })}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.map((owner) => {
                    const stats = getOwnerStats(owner);
                    
                    return (
                      <TableRow key={owner.id} className="hover:bg-muted/50 transition-colors duration-200">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white text-sm font-medium">
                              {(owner.first_name?.[0] || owner.email?.[0] || '?').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {owner.first_name && owner.last_name 
                                  ? `${owner.first_name} ${owner.last_name}`
                                  : owner.email?.split('@')[0] || 'N/A'
                                }
                              </div>
                              {owner.company && (
                                <div className="text-sm text-muted-foreground">{owner.company}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {owner.email}
                            </div>
                            {owner.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {owner.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{stats.totalProperties}</span>
                            <span className="text-sm text-muted-foreground">
                              ({stats.totalUnits} unités)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span className="font-medium">{stats.activeTenants}</span>
                            <span className="text-sm text-muted-foreground">
                              / {stats.totalTenants}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={stats.occupancyRate >= 80 ? "default" : stats.occupancyRate >= 60 ? "secondary" : "destructive"}
                          >
                            {stats.occupancyRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium">${stats.totalRevenue.toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted transition-colors duration-200">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t('actions', { fallback: 'Actions' })}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(owner)} className="hover:bg-muted transition-colors duration-200">
                                <Eye className="h-4 w-4 mr-2" />
                                {t('viewDetails', { fallback: 'Voir détails' })}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageProperties(owner)} className="hover:bg-muted transition-colors duration-200">
                                <Building2 className="h-4 w-4 mr-2" />
                                {t('manageProperties', { fallback: 'Gérer propriétés' })}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};