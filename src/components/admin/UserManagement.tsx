import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { 
  Loader2, 
  Search, 
  UserPlus, 
  Mail, 
  Calendar,
  MoreHorizontal,
  Shield,
  User,
  Settings
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

export const UserManagement = () => {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users with profiles and roles
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          tenants!tenants_tenant_profile_id_fkey(
            id,
            name,
            property_id,
            properties(name)
          ),
          properties_owned:properties!properties_user_id_fkey(
            id,
            name,
            type
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserRole = (user: any) => {
    if (user.user_roles && user.user_roles.length > 0) {
      return user.user_roles[0].role;
    }
    return 'user';
  };

  const getUserType = (user: any) => {
    if (user.is_tenant_user) return 'tenant';
    if (user.properties_owned && user.properties_owned.length > 0) return 'owner';
    return 'user';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'moderator': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'tenant': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'owner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

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
            {t('userManagement', { fallback: 'Gestion des Utilisateurs' })}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('manageSystemUsers', { fallback: 'Gérer tous les utilisateurs du système' })}
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t('addUser', { fallback: 'Ajouter Utilisateur' })}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('searchUsers', { fallback: 'Rechercher des utilisateurs...' })}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('systemUsers', { fallback: 'Utilisateurs du Système' })}
            <Badge variant="secondary">{filteredUsers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('user', { fallback: 'Utilisateur' })}</TableHead>
                  <TableHead>{t('email', { fallback: 'Email' })}</TableHead>
                  <TableHead>{t('role', { fallback: 'Rôle' })}</TableHead>
                  <TableHead>{t('type', { fallback: 'Type' })}</TableHead>
                  <TableHead>{t('properties', { fallback: 'Propriétés' })}</TableHead>
                  <TableHead>{t('createdAt', { fallback: 'Créé le' })}</TableHead>
                  <TableHead className="text-right">{t('actions', { fallback: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const role = getUserRole(user);
                  const type = getUserType(user);
                  const propertiesCount = user.properties_owned?.length || 0;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white text-sm font-medium">
                            {(user.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user.email?.split('@')[0] || 'N/A'
                              }
                            </div>
                            {user.company && (
                              <div className="text-sm text-muted-foreground">{user.company}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(role)}>
                          <Shield className="h-3 w-3 mr-1" />
                          {role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeBadgeColor(type)}>
                          {type === 'tenant' && '🏠'}
                          {type === 'owner' && '🏢'}
                          {type === 'user' && '👤'}
                          {type === 'tenant' ? t('tenant', { fallback: 'Locataire' }) :
                           type === 'owner' ? t('owner', { fallback: 'Propriétaire' }) :
                           t('user', { fallback: 'Utilisateur' })}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{propertiesCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('actions', { fallback: 'Actions' })}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              {t('editUser', { fallback: 'Modifier' })}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              {t('manageRoles', { fallback: 'Gérer les rôles' })}
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
  );
};