import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Shield, 
  User, 
  UserPlus,
  UserMinus,
  Crown,
  Settings,
  Info
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type AppRole = 'admin' | 'moderator' | 'user';

export const AdminRoles = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("user");

  // Fetch users with their roles - simplified approach
  const { data: usersWithRoles = [], isLoading, error } = useQuery({
    queryKey: ['admin_users_roles'],
    queryFn: async () => {
      console.log('🔍 Fetching users and roles for admin...');
      
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, company, created_at')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      console.log('✅ Profiles fetched:', profiles?.length);
      
      // Then get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) {
        console.error('❌ Error fetching roles:', rolesError);
        // Don't throw, just log the error and continue with empty roles
        console.warn('⚠️ Continuing without roles data');
      }
      
      console.log('✅ Roles fetched:', roles?.length || 0);
      
      // Combine profiles with their roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: roles?.filter(role => role.user_id === profile.id) || []
      })) || [];
      
      console.log('📊 Combined users with roles:', usersWithRoles.length);
      return usersWithRoles;
    }
  });

  // Real-time updates for automatic refresh
  useEffect(() => {
    console.log('🔄 Setting up real-time listeners for admin roles...');
    
    const userRolesChannel = supabase
      .channel('user_roles_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'user_roles'
        },
        (payload) => {
          console.log('🔄 User roles changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin_users_roles'] });
          queryClient.invalidateQueries({ queryKey: ['admin_all_users'] });
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('🔄 Profiles changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['admin_users_roles'] });
          queryClient.invalidateQueries({ queryKey: ['admin_all_users'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up real-time listeners...');
      supabase.removeChannel(userRolesChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [queryClient]);

  // Fetch all users for role assignment - simplified approach
  const { data: allUsers = [] } = useQuery({
    queryKey: ['admin_all_users'],
    queryFn: async () => {
      console.log('🔍 Fetching all users for role assignment...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching all users:', error);
        throw error;
      }
      
      console.log('✅ All users fetched:', data?.length);
      return data || [];
    }
  });

  // Filter users without roles on the client side
  const usersWithoutRoles = allUsers.filter(user => {
    const userWithRole = usersWithRoles.find(u => u.id === user.id);
    return !userWithRole || !userWithRole.user_roles || userWithRole.user_roles.length === 0;
  });

  console.log('📊 Users without roles:', usersWithoutRoles.length);

  // Mutation to assign role
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users_roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin_all_users'] });
      toast({
        title: t('success', { fallback: 'Succès' }),
        description: t('roleAssigned', { fallback: 'Rôle assigné avec succès' }),
      });
      setSelectedUserId("");
      setSelectedRole("user");
    },
    onError: (error) => {
      toast({
        title: t('error', { fallback: 'Erreur' }),
        description: t('errorAssigningRole', { fallback: 'Erreur lors de l\'assignation du rôle' }),
        variant: "destructive",
      });
    }
  });

  // Mutation to remove role
  const removeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users_roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin_all_users'] });
      toast({
        title: t('success', { fallback: 'Succès' }),
        description: t('roleRemoved', { fallback: 'Rôle supprimé avec succès' }),
      });
    },
    onError: (error) => {
      toast({
        title: t('error', { fallback: 'Erreur' }),
        description: t('errorRemovingRole', { fallback: 'Erreur lors de la suppression du rôle' }),
        variant: "destructive",
      });
    }
  });

  const getUserRole = (user: any): AppRole | null => {
    if (user.user_roles && user.user_roles.length > 0) {
      return user.user_roles[0].role;
    }
    return null;
  };

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'moderator': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin': return Crown;
      case 'moderator': return Settings;
      default: return User;
    }
  };

  const handleAssignRole = () => {
    if (selectedUserId && selectedRole) {
      assignRoleMutation.mutate({ userId: selectedUserId, role: selectedRole });
    }
  };

  const handleRemoveRole = (userId: string) => {
    removeRoleMutation.mutate(userId);
  };

  const roleStats = {
    admin: usersWithRoles.filter(u => getUserRole(u) === 'admin').length,
    moderator: usersWithRoles.filter(u => getUserRole(u) === 'moderator').length,
    totalUsers: usersWithRoles.length, // Total number of users (all profiles)
    noRole: usersWithoutRoles.length
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
            {t('roleManagement', { fallback: 'Gestion des Rôles' })}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('manageUserRoles', { fallback: 'Gérer les rôles et permissions des utilisateurs' })}
          </p>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{t('admins', { fallback: 'Administrateurs' })}</p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="top">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Crown className="h-4 w-4 text-red-600" />
                          Administrateurs
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Les administrateurs ont un accès complet à toutes les fonctionnalités :
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Gestion complète des utilisateurs et rôles</li>
                          <li>• Accès à toutes les données du système</li>
                          <li>• Configuration système et paramètres</li>
                          <li>• Supervision de toutes les activités</li>
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p className="text-2xl font-bold">{roleStats.admin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{t('moderators', { fallback: 'Modérateurs' })}</p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="top">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Settings className="h-4 w-4 text-orange-600" />
                          Modérateurs
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Les modérateurs ont des droits étendus mais limités :
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Gestion des contenus et publications</li>
                          <li>• Modération des interactions utilisateurs</li>
                          <li>• Accès aux rapports et statistiques</li>
                          <li>• Pas d'accès aux paramètres système</li>
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p className="text-2xl font-bold">{roleStats.moderator}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{t('totalUsers', { fallback: 'Total Utilisateurs' })}</p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="top">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-600" />
                          Total Utilisateurs
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Nombre total d'utilisateurs enregistrés dans le système, incluant :
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Utilisateurs avec rôles (admin, modérateur, utilisateur)</li>
                          <li>• Utilisateurs sans rôle assigné</li>
                          <li>• Tous les profils créés</li>
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p className="text-2xl font-bold">{roleStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{t('noRole', { fallback: 'Sans rôle' })}</p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="top">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-blue-600" />
                          Utilisateurs sans rôle
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Utilisateurs enregistrés mais sans rôle spécifique assigné :
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Accès de base au système uniquement</li>
                          <li>• Peuvent être assignés à un rôle</li>
                          <li>• Permissions limitées par défaut</li>
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p className="text-2xl font-bold">{roleStats.noRole}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t('assignRole', { fallback: 'Assigner un Rôle' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectUser', { fallback: 'Sélectionner un utilisateur' })} />
                </SelectTrigger>
                <SelectContent>
                  {usersWithoutRoles.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name} (${user.email})`
                        : user.email
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('user', { fallback: 'Utilisateur' })}
                    </div>
                  </SelectItem>
                  <SelectItem value="moderator">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t('moderator', { fallback: 'Modérateur' })}
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      {t('admin', { fallback: 'Administrateur' })}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAssignRole}
              disabled={!selectedUserId || assignRoleMutation.isPending}
              className="flex-shrink-0"
            >
              {assignRoleMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {t('assign', { fallback: 'Assigner' })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users with Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('usersWithRoles', { fallback: 'Utilisateurs avec Rôles' })}
            <Badge variant="secondary">{usersWithRoles.filter(u => getUserRole(u)).length}</Badge>
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
                  <TableHead className="text-right">{t('actions', { fallback: 'Actions' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersWithRoles.filter(user => getUserRole(user)).map((user) => {
                  const role = getUserRole(user);
                  const RoleIcon = role ? getRoleIcon(role) : User;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
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
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {role && (
                          <Badge className={getRoleBadgeColor(role)}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {role}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveRole(user.id)}
                          disabled={removeRoleMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          {removeRoleMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserMinus className="h-4 w-4" />
                          )}
                        </Button>
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