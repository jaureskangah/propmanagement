import React, { useState } from "react";
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
  Settings
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

type AppRole = 'admin' | 'moderator' | 'user';

export const AdminRoles = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("user");

  // Fetch users with their roles
  const { data: usersWithRoles = [], isLoading } = useQuery({
    queryKey: ['admin_users_roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          company,
          user_roles(role)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch users without roles for assignment
  const { data: usersWithoutRoles = [] } = useQuery({
    queryKey: ['admin_users_without_roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name
        `)
        .not('id', 'in', 
          `(${usersWithRoles.filter(u => u.user_roles && u.user_roles.length > 0).map(u => `'${u.id}'`).join(',') || "''"})`)
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    enabled: usersWithRoles.length > 0
  });

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
      queryClient.invalidateQueries({ queryKey: ['admin_users_without_roles'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin_users_without_roles'] });
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
    user: usersWithRoles.filter(u => getUserRole(u) === 'user').length,
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
              <div>
                <p className="text-sm text-muted-foreground">{t('admins', { fallback: 'Administrateurs' })}</p>
                <p className="text-2xl font-bold">{roleStats.admin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('moderators', { fallback: 'Modérateurs' })}</p>
                <p className="text-2xl font-bold">{roleStats.moderator}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('regularUsers', { fallback: 'Utilisateurs' })}</p>
                <p className="text-2xl font-bold">{roleStats.user}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">{t('noRole', { fallback: 'Sans rôle' })}</p>
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